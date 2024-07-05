import { AxiosInstance } from 'axios'
import { InstantiateOptions, Services } from './http.interface'
import HttpManager from './http.manager'
import { AuthService, UserService } from '../services'

export class HttpClient {
  private static _instance: HttpClient

  private static _instantiateOptions: InstantiateOptions

  private _publicAxios: AxiosInstance
  private _privateAxios: AxiosInstance
  private _services: Services

  constructor() {
    // instantiate singleton instance of axios
    this._publicAxios = HttpManager.createPublicAxios(
      HttpClient.instantiateOptions.public.host,
      HttpClient.instantiateOptions.public.timeout,
      HttpClient.instantiateOptions.public.interceptorOptions,
    )
    this._privateAxios = HttpManager.createPublicAxios(
      HttpClient.instantiateOptions.private.host,
      HttpClient.instantiateOptions.private.timeout,
      HttpClient.instantiateOptions.private.interceptorOptions,
    )

    // instantiate singleton instance of services
    this._services = {
      authService: new AuthService(this._publicAxios),
      userService: new UserService(this._privateAxios),
    }
  }

  public static instantiate(options: InstantiateOptions): void {
    this._instantiateOptions = options
    this._instance = new HttpClient()
  }

  public static get instantiateOptions(): InstantiateOptions {
    return this._instantiateOptions
  }

  public static get instance(): HttpClient {
    if (!this._instance) {
      throw new Error('Please instantiate before get instance.')
    }
    return this._instance
  }

  private services(): Services {
    return this._services
  }
}
