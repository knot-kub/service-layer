import { HttpStatusCode, AxiosResponse } from 'axios'

export interface InitialOptions {
  request: RequestOptions
  response: ResponseOptions
}

export interface RequestOptions {
  currentLanguage?: () => string
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
