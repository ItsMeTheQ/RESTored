import type IRequestOptions from "../interfaces/IRequestOptions"
import type IDataRecord from "../interfaces/IDataRecord"

export default interface IDataStore {
    get(options: IRequestOptions): IDataRecord[]
    set(options: IRequestOptions): void
    setAll(options: IRequestOptions, records: IDataRecord[]): void
    remove(options: IRequestOptions): void

    register(name: string): void

    link(options: IRequestOptions): void
    getAllElements(record: IDataRecord): IDataRecord[]

    addToStoreMapping(options: IRequestOptions, position: number): void
}