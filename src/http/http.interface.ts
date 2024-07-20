import { HttpStatusCode, AxiosResponse } from 'axios'
import { AuthService, UserService } from '../services'

export interface InterceptorOptions {
  request: RequestOptions
  response: ResponseOptions
}

export interface RequestOptions {
  currentLanguage?: () => string
  tokenHandler?: () => string
}

export type ResponseOptions = ErrorResponseOptions & SuccessResponseOptions

export type ErrorResponseOptions = {
  [key in ErrorHttpStatusCode]?: ErrorResponseFunction
}
export type SuccessResponseOptions = {
  [key in SuccessHttpStatusCode]?: SuccessResponseFunction
}

export type ErrorHttpStatusCode = Exclude<HttpStatusCode, SuccessHttpStatusCode>
export type SuccessHttpStatusCode =
  | HttpStatusCode.Ok
  | HttpStatusCode.Created
  | HttpStatusCode.Accepted
  | HttpStatusCode.NonAuthoritativeInformation
  | HttpStatusCode.NoContent
  | HttpStatusCode.ResetContent
  | HttpStatusCode.PartialContent
  | HttpStatusCode.MultiStatus
  | HttpStatusCode.AlreadyReported
  | HttpStatusCode.ImUsed

export type SuccessResponseFunction = (response: AxiosResponse) => void
export type ErrorResponseFunction = (error: any) => void

export interface InstantiateOptions {
  private: InstantiateOption
  public: InstantiateOption
}

export interface InstantiateOption {
  host: string
  timeout: number
  interceptorOptions: InterceptorOptions
}

export interface Services {
  auth: AuthService
  user: UserService
}
