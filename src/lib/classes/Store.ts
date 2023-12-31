import type IRequestOptions from "../interfaces/IRequestOptions"
import type IDataRecord from "../interfaces/IDataRecord"
import type IStore from "../interfaces/IStore"
import DataStore from "./DataStore"
import type IDataRecordConstructor from "../interfaces/IDataRecordConstructor"
import RequestOptions from "./RequestOptions"
import type IDataStore from "../interfaces/IDataStore"
import NoPrimaryError from "../errors/NoPrimaryError"
import DataRecordNotLinkedError from "../errors/DataRecordNotLinkedError"
import DataResponse from "./DataResponse";

enum RequestMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

class NewBuilder {
    private readonly store: IStore
    private recordClasses: Map<string, IDataRecordConstructor>

    constructor(store: IStore, recordClasses: Map<string, IDataRecordConstructor>) {
        this.store = store
        this.recordClasses = recordClasses
    }

    record(recordType: string): IDataRecord {
        return new (this.recordClasses.get(recordType))(this.store)
    }

    request(recordType: string): IRequestOptions {
        const record: IDataRecord = new (this.recordClasses.get(recordType))(this.store)
        const requestOptions: IRequestOptions = new RequestOptions().setRecord(record)
        for (let key of Array.from(this.store.defaultHeaders.keys())) {
            requestOptions.addHeader(key, this.store.defaultHeaders.get(key))
        }
        return requestOptions
    }
}


export default class Store implements IStore {
    private recordClasses: Map<string, IDataRecordConstructor> = new Map<string, IDataRecordConstructor>()

    public defaultHeaders: Map<string, string> = new Map<string, string>()
    public records: IDataStore = new DataStore()

    register(record: IDataRecordConstructor): Store {
        const recordInstance: IDataRecord = new record(this)
        this.records.register(recordInstance.recordType())
        this.recordClasses.set(recordInstance.recordType(), record)
        return this
    }

    get new(): NewBuilder {
        return new NewBuilder(this, this.recordClasses)
    }

    addHeader(key: string, value: string): IStore {
        this.defaultHeaders.set(key, value)
        return this
    }

    removeHeader(key: string): IStore {
        this.defaultHeaders.delete(key)
        return this
    }

    get(options: IRequestOptions): IDataRecord[] {
        options.setMultiple(true)
        return this.records.get(options) as IDataRecord[]
    }

    getSingle(options: IRequestOptions): IDataRecord {
        options.setMultiple(false)
        const records: IDataRecord[] = this.records.get(options) as IDataRecord[]
        return records.length > 0 ? records[0] : undefined
    }

    link(options: IRequestOptions): void {
        if (options.record.getPrimary() === '') {
            throw new NoPrimaryError(options.record)
        }
        this.records.link(options)
    }

    unlink(record: IDataRecord): void {
        const allRecords: IDataRecord[] = this.records.getAllElements(record)
        const elements: IDataRecord[] = allRecords.filter((element: IDataRecord) => {
            return element.getUuid() === record.getUuid()
        })
        const index: number = allRecords.findIndex((element: IDataRecord) => {
            return element.getUuid() === record.getUuid()
        })
        if (elements.length === 0) {
            throw new DataRecordNotLinkedError(record)
        }
        const output: IDataRecord = this.new.record(record.recordType())
        output.deserialize(record.serialize())
        output.setIsNew(false)
        allRecords.splice(index, 1, output)
    }

    private async request(options: IRequestOptions): Promise<Response> {
        const output = ['UPDATE', 'POST'].includes(options.getRequestMethod()) ? options.record.serialize() : undefined
        const init: RequestInit = {
            method: options.getRequestMethod(),
            headers: options.getHeaders()
        }
        if (output) {
            init['body'] = JSON.stringify(output)
        }
        return await fetch(options.getUrlWithParams(), init)
    }

    private createDataResponse(response: Response): DataResponse {
        return new DataResponse(response)
    }

    async find(options: IRequestOptions): Promise<DataResponse> {
        options.setMultiple(false).setRequestMethod(RequestMethods.GET)
        const response: DataResponse = this.createDataResponse(await this.request(options))
        if (response.ok) {
            const dataset: { [key: string]: unknown } = await response.response.json()
            const record: IDataRecord = this.new.record(options.record.recordType())
            record.deserialize(dataset)
            record.setIsNew(false)
            options.setRecord(record)
            this.records.set(options)
            response.setRecord(this.getSingle(options))
        }
        return response
    }

    async findAll(options: IRequestOptions): Promise<DataResponse> {
        options.setMultiple(true).setRequestMethod(RequestMethods.GET)
        const response: DataResponse = this.createDataResponse(await this.request(options))
        if (response.ok) {
            const datasets: [{ [key: string]: unknown }] = await response.response.json()
            const records: IDataRecord[] = []
            for (let dataset of datasets) {
                const record: IDataRecord = this.new.record(options.record.recordType())
                record.deserialize(dataset)
                record.setIsNew(false)
                records.push(record)
            }
            this.records.setAll(options, records)
            response.setRecords(this.get(options))
        }
        return response
    }

    async create(options: IRequestOptions): Promise<DataResponse> {
        options.setMultiple(true).setRequestMethod(RequestMethods.POST)
        const response: DataResponse = this.createDataResponse(await this.request(options))
        if (response.ok) {
            const dataset: { [key: string]: unknown } = await response.response.json()
            const record: IDataRecord = options.record
            record.deserialize(dataset)
            record.setIsNew(false)
            this.records.set(options)
            record.link()
            response.setRecord(this.getSingle(options))
        }
        return response
    }

    async update(options: IRequestOptions): Promise<DataResponse> {
        options.setMultiple(false).setRequestMethod(RequestMethods.PUT)
        const response: DataResponse = this.createDataResponse(await this.request(options))
        if (response.ok) {
            const dataset: { [key: string]: unknown } = await response.response.json()
            const record: IDataRecord = options.record
            record.deserialize(dataset)
            record.setIsNew(false)
            this.records.set(options)
            response.setRecord(this.getSingle(options))
        }
        return response
    }

    async delete(options: IRequestOptions): Promise<DataResponse> {
        options.setMultiple(false).setRequestMethod(RequestMethods.DELETE)
        const response: DataResponse = this.createDataResponse(await this.request(options))
        if (response.ok) {
            this.records.remove(options)
        }
        return response
    }
}

export {NewBuilder, RequestMethods}