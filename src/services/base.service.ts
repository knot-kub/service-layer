import { GenericDeserialize } from 'cerialize'

export class BaseService {
  protected getResult<T>(json: any, cnstr: new () => T): T {
    return GenericDeserialize<T>(json, cnstr)
  }

  protected getResults<T>(jsonArray: any[], cnstr?: new () => T): T[] {
    const result: T[] = []
    for (const json of jsonArray) {
      if (
        typeof json === 'string' ||
        typeof json === 'number' ||
        typeof json === 'boolean'
      ) {
        result.push(json as T)
        continue
      }

      if (cnstr) {
        result.push(GenericDeserialize<T>(json, cnstr))
      }
    }
    return result
  }
}
