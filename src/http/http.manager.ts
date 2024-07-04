import axios, {
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  ErrorResponseFunction,
  InitialOptions,
  ResponseOptions,
  SuccessResponseFunction,
} from './http.interface'

export default class HttpManager {
  private static defaultLanguage = 'en'

  public static createAuthAxios(
    url: string,
    tokenHandler: () => string,
    options: InitialOptions,
  ): AxiosInstance {
    const _axiosInstance = axios.create({
      baseURL: url,
      timeout: 20 * 1000,
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
        this.tokenRequestInterceptor(axiosRequestConfig, tokenHandler),
    )

    /** Response Interceptor */
    _axiosInstance.interceptors.response.use(
      (response: AxiosResponse) =>
        this.successResponseInterceptor(response, options.response),
      (error: any) => this.errorResponseInterceptor(error, options.response),
    )

    return _axiosInstance
  }

  public static createSecureAxios(
    url: string,
    tokenHandler: () => string,
    options: InitialOptions,
  ): AxiosInstance {
    const _axiosInstance = axios.create({
      baseURL: url,
      timeout: 20 * 1000,
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
        this.tokenRequestInterceptor(axiosRequestConfig, tokenHandler),
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
    axiosRequestConfig.headers['x-language'] = language
    return axiosRequestConfig
  }

  private static tokenRequestInterceptor(
    axiosRequestConfig: InternalAxiosRequestConfig,
    tokenHandler: () => string,
  ): InternalAxiosRequestConfig {
    const token = tokenHandler()
    axiosRequestConfig.headers['Authorization'] = `Bearer ${token}`
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
