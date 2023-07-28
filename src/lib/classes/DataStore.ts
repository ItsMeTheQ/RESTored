import IDataStore from "../interfaces/IDataStore";
import IRequestOptions from "../interfaces/IRequestOptions";
import IDataRecord from "../interfaces/IDataRecord";
import DataStoreMapElement from "../classes/DataStoreMapElement";
import DataRecordNotRegistered from "../errors/DataRecordNotRegistered";

export default class DataStore implements IDataStore {
    data: Map<string, DataStoreMapElement> = new Map<string, DataStoreMapElement>()

    private has(options: IRequestOptions): boolean {
        return this.data.has(options.record.recordType());
    }

    get(options: IRequestOptions): IDataRecord[] {
        const mapElement: DataStoreMapElement = this.data.get(options.record.recordType())
        if (!mapElement) {
            throw new DataRecordNotRegistered(options.record)
        }
        return this.data.get(options.record.recordType()).get(options) as IDataRecord[];
    }

    remove(options: IRequestOptions): void {
        if (this.data.has(options.record.recordType())) {
            this.data.get(options.record.recordType()).remove(options)
        }
    }

    set(options: IRequestOptions): void {
        if (this.data.has(options.record.recordType())) {
            this.data.get(options.record.recordType()).set(options)
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

    link(options: IRequestOptions): void {
        this.data.get(options.record.recordType()).link(options)
    }

    getAllElements(record: IDataRecord): IDataRecord[] {
        return this.data.get(record.recordType()).list
    }

    addToStoreMapping(options: IRequestOptions, position: number): void {
        if (position <= 0) {
            position = 0
        }
        const maxLength: number = this.data.get(options.record.recordType()).map.get(options.getUrl()).length - 1
        if (position >= maxLength) {
            position = maxLength
        }
        this.data.get(
            options.record.recordType()
        ).map.get(
            options.getUrl()
        ).splice(position, 0, options.record.getPrimary())
    }
}
