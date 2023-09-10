import type IDataRecord from "../interfaces/IDataRecord"
import type IRequestOptions from "../interfaces/IRequestOptions"
import Store from "../classes/Store"
import {NewBuilder} from "../classes/Store"
import type IDataStore from "./IDataStore"
import DataResponse from "../classes/DataResponse";


export default interface IStore {
    defaultHeaders: Map<string, string>
    records: IDataStore
    new: NewBuilder

    addHeader(key: string, value: string): IStore
    removeHeader(key: string): IStore

    register(record: new () => IDataRecord): Store

    getSingle(options: IRequestOptions): IDataRecord
    get(options: IRequestOptions): IDataRecord[]

    link(options: IRequestOptions): void
    unlink(record: IDataRecord): void

    find(options: IRequestOptions): Promise<DataResponse>
    findAll(options: IRequestOptions): Promise<DataResponse>

    create(options: IRequestOptions): Promise<DataResponse>
    update(options: IRequestOptions): Promise<DataResponse>
    delete(options: IRequestOptions): Promise<DataResponse>
}
