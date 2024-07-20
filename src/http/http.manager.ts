import axios, {
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  ErrorResponseFunction,
  InterceptorOptions,
  ResponseOptions,
  SuccessResponseFunction,
} from './http.interface'

export default class HttpManager {
  private static defaultLanguage = 'en'

  public static createAxios(
    url: string,
    timeout: number,
    options: InterceptorOptions,
  ): AxiosInstance {
    const _axiosInstance = axios.create({
      baseURL: url,
      timeout,
    })

    /** Request Interceptor */
    _axiosInstance.interceptors.request.use(this.basicRequestInterceptor)
    _axiosInstance.interceptors.request.use(
      (axiosRequestConfig: InternalAxiosRequestConfig) =>
        this.languageRequestInterceptor(
          axiosRequestConfig,
          options.request.currentLanguage,
        ),
    )
    _axiosInstance.interceptors.request.use(
      (axiosRequestConfig: InternalAxiosRequestConfig) =>
        this.tokenRequestInterceptor(
          axiosRequestConfig,
          options.request.tokenHandler,
        ),
    )

    /** Response Interceptor */
    _axiosInstance.interceptors.response.use(
      (response: AxiosResponse) =>
        this.successResponseInterceptor(response, options.response),
      (error: any) => this.errorResponseInterceptor(error, options.response),
    )

    return _axiosInstance
  }

  private static basicRequestInterceptor(
    axiosRequestConfig: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    axiosRequestConfig.headers['Accept'] = 'application/json'
    return axiosRequestConfig
  }

  private static languageRequestInterceptor(
    axiosRequestConfig: InternalAxiosRequestConfig,
    currentLanguage?: () => string,
  ): InternalAxiosRequestConfig {
    const language = currentLanguage?.call(this) ?? this.defaultLanguage
    axiosRequestConfig.headers['X-Language'] = language
    return axiosRequestConfig
  }

  private static tokenRequestInterceptor(
    axiosRequestConfig: InternalAxiosRequestConfig,
    tokenHandler?: () => string | null,
  ): InternalAxiosRequestConfig {
    const token = tokenHandler?.call(this)
    if (token) {
      axiosRequestConfig.headers['Authorization'] = `Bearer ${token}`
    }
    return axiosRequestConfig
  }

  private static successResponseInterceptor(
    response: AxiosResponse,
    responseOptions: ResponseOptions,
  ): AxiosResponse {
    // status must in range 2xx
    const status: number = response.status
    let successCode: HttpStatusCode = HttpStatusCode.Ok
    if (status in HttpStatusCode) {
      successCode = status
    }
    const executor = responseOptions[successCode] as
      | SuccessResponseFunction
      | undefined
    executor?.call(this, response)
    return response
  }

  private static errorResponseInterceptor(
    error: any,
    responseOptions: ResponseOptions,
  ): Promise<never> {
    // status must not in range 2xx
    const status: number = error.response?.status
    let successCode: HttpStatusCode = HttpStatusCode.InternalServerError
    if (status in HttpStatusCode) {
      successCode = status
    }
    const executor = responseOptions[successCode] as
      | ErrorResponseFunction
      | undefined
    executor?.call(this, error)

    return Promise.reject(error)
  }
}
