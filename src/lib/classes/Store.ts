import IRequestOptions from "../interfaces/IRequestOptions";
import IDataRecord from "../interfaces/IDataRecord";
import IStore from "../interfaces/IStore";
import DataStore from "./DataStore";
import IDataRecordConstructor from "../interfaces/IDataRecordConstructor";
import RequestOptions from "./RequestOptions";
import IDataStore from "../interfaces/IDataStore";
import NoPrimaryError from "../errors/NoPrimaryError";
import DataRecordNotLinkedError from "../errors/DataRecordNotLinkedError";

enum RequestMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

class NewBuilder {
    private readonly store: IStore;
    private recordClasses: Map<string, IDataRecordConstructor>;

    constructor(store: IStore, recordClasses: Map<string, IDataRecordConstructor>) {
        this.store = store;
        this.recordClasses = recordClasses;
    }

    record(recordType: string): IDataRecord {
        return new (this.recordClasses.get(recordType))(this.store)
    }

    request(recordType: string): IRequestOptions {
        const record: IDataRecord = new (this.recordClasses.get(recordType))(this.store);
        const requestOptions: IRequestOptions = new RequestOptions().setRecord(record)
        for (let key in this.store.defaultHeaders.keys()) {
            requestOptions.addHeader(key, this.store.defaultHeaders.get(key))
        }
        return requestOptions
    }
}


export default class Store implements IStore {
    private recordClasses: Map<string, IDataRecordConstructor> = new Map<string, IDataRecordConstructor>();

    public defaultHeaders: Map<string, string>;
    public records: IDataStore = new DataStore();

    register(record: IDataRecordConstructor): Store {
        const recordInstance: IDataRecord = new record(this);
        this.records.register(recordInstance.recordType());
        this.recordClasses.set(recordInstance.recordType(), record);
        return this;
    }

    get new(): NewBuilder {
        return new NewBuilder(this, this.recordClasses)
    }

    addHeader(key: string, value: string): IStore {
        this.defaultHeaders.set(key, value);
        return this;
    }

    removeHeader(key: string): IStore {
        this.defaultHeaders.delete(key);
        return this;
    }

    get(options: IRequestOptions): IDataRecord[] {
        return this.records.get(options) as IDataRecord[];
    }

    getSingle(options: IRequestOptions): IDataRecord {
        const records: IDataRecord[] = this.records.get(options) as IDataRecord[];
        return records.length > 0 ? records[0] : undefined
    }

    link(record: IDataRecord): void {
        if (record.getPrimary() === '') {
            throw new NoPrimaryError(record)
        }
        this.records.link(record)
    }

    unlink(record: IDataRecord): IDataRecord {
        const elements: IDataRecord[] = this.records.getAllElements(record).filter((element: IDataRecord) => {
            return element.getUuid() === record.getUuid()
        })
        if (elements.length === 0) {
            throw new DataRecordNotLinkedError(record)
        }
        const output: IDataRecord = this.new.record(record.recordType())
        output.deserialize(record.serialize())
        return output
    }

    private async request(options: IRequestOptions): Promise<Response> {
        return await fetch(options.getUrlWithParams(), {
            method: options.getRequestMethod(),
            headers: options.getHeaders(),
            // @ts-ignore
            body: method in ['UPDATE', 'POST'] ? options.record.serialize() : undefined
        });
    }

    async find(options: IRequestOptions): Promise<Response> {
        options.setMultiple(false)
        const response: Response = await this.request(options);
        const dataset: { [key: string]: unknown } = await response.json();
        const record: IDataRecord = this.new.record(options.record.recordType())
        record.deserialize(dataset)
        this.records.set(options, record)
        return response
    }

    async findAll(options: IRequestOptions): Promise<Response> {
        options.setMultiple(true)
        const response: Response = await this.request(options);
        const datasets: [{ [key: string]: unknown }] = await response.json();
        const records: IDataRecord[] = []
        for (let dataset of datasets) {
            const record: IDataRecord = this.new.record(options.record.recordType())
            record.deserialize(dataset)
        }
        this.records.setAll(options, records)
        return response
    }

    async create(options: IRequestOptions): Promise<Response> {
        options.setMultiple(false).setRequestMethod(RequestMethods.POST)
        const response: Response = await this.request(options);
        const dataset: { [key: string]: unknown } = await response.json();
        const record: IDataRecord = this.new.record(options.record.recordType())
        record.deserialize(dataset)
        this.records.set(options, record)
        return response
    }

    async update(options: IRequestOptions): Promise<Response> {
        options.setMultiple(false).setRequestMethod(RequestMethods.PUT)
        const response: Response = await this.request(options);
        const dataset: { [key: string]: unknown } = await response.json();
        const record: IDataRecord = this.new.record(options.record.recordType())
        record.deserialize(dataset)
        return response
    }


    async delete(options: IRequestOptions): Promise<Response> {
        options.setMultiple(false).setRequestMethod(RequestMethods.DELETE)
        const response: Response = await this.request(options);
        const dataset: { [key: string]: unknown } = await response.json();
        const record: IDataRecord = this.new.record(options.record.recordType())
        this.records.remove(options, record)
        return response
    }
}

export {NewBuilder, RequestMethods}