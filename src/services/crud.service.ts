import { AxiosInstance } from 'axios'
import { BaseService } from './base.service'

export class CrudService<T> extends BaseService {
  constructor(
    protected readonly cnstr: new () => T,
    protected readonly resourceKey: string,
    protected readonly axios: AxiosInstance,
  ) {
    super()
  }

  protected async index(): Promise<{ items: T[]; count: number }> {
    const response = await this.axios.get(`/${this.resourceKey}`)
    return {
      items: this.getResults(this.cnstr, response.data.items),
      count: response.data.count,
    }
  }

  protected async getOne(id: string | number): Promise<T> {
    const response = await this.axios.get(`/${this.resourceKey}/${id}`)
    return this.getResult(this.cnstr, response.data)
  }

  protected async deleteOne(id: string | number): Promise<void> {
    await this.axios.delete(`/${this.resourceKey}/${id}`)
  }

  protected async updateOne(
    id: string | number,
    entity: Partial<T>,
  ): Promise<T> {
    const response = await this.axios.patch(
      `/${this.resourceKey}/${id}`,
      entity,
    )
    return this.getResult(this.cnstr, response.data)
  }

  protected async createOne(entity: T): Promise<T> {
    const response = await this.axios.post(`/${this.resourceKey}`, entity)
    return this.getResult(this.cnstr, response.data)
  }
}
