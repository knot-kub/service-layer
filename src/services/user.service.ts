import { AxiosInstance } from 'axios'
import { BaseService } from './base.service'

export class UserService extends BaseService {
  constructor(private readonly axios: AxiosInstance) {
    super()
  }
}
