import IDataStore from "../interfaces/IDataStore";
import IRequestOptions from "../interfaces/IRequestOptions";
import IDataRecord from "../interfaces/IDataRecord";
import DataStoreMapElement from "../classes/DataStoreMapElement";

export default class DataStore implements IDataStore {
    data: Map<string, DataStoreMapElement> = new Map<string, DataStoreMapElement>()

    private has(options: IRequestOptions): boolean {
        return this.data.has(options.record.recordType());
    }

    get(options: IRequestOptions): IDataRecord[] {
        return this.get(options) as IDataRecord[];
    }

    remove(options: IRequestOptions, record: IDataRecord): void {
        if (this.data.has(options.record.recordType())) {
            this.data.get(options.record.recordType()).remove(options, record)
        }
    }

    set(options: IRequestOptions, record: IDataRecord): void {
        if (this.data.has(options.record.recordType())) {
            this.data.get(options.record.recordType()).set(options, record)
        }
    }

    setAll(options: IRequestOptions, records: IDataRecord[]): void {
        if (this.data.has(options.record.recordType())) {
            this.data.get(options.record.recordType()).setAll(options, records)
        }
    }

    register(name: string): void {
        this.data.set(name, new DataStoreMapElement())
    }

    link(record: IDataRecord): void {
        this.data.get(record.recordType()).link(record)
    }

    getAllElements(record: IDataRecord): IDataRecord[] {
        return this.data.get(record.recordType()).list
    }
}
