import { GenericDeserialize } from 'cerialize'

export class BaseService {
  protected getResult<T>(cnstr: new () => T, json: any): T {
    return GenericDeserialize<T>(json, cnstr)
  }

  protected getResults<T>(cnstr: new () => T, jsonArray: any[]): T[] {
    const result: T[] = []
    for (const json of jsonArray) {
      result.push(GenericDeserialize<T>(json, cnstr))
    }
    return result
  }
}
