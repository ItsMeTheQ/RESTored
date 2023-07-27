import IRequestOptions from "../interfaces/IRequestOptions";
import IDataRecord from "../interfaces/IDataRecord";

export default interface IDataStore {
    get(options: IRequestOptions): IDataRecord[];
    set(options: IRequestOptions, record: IDataRecord): void;
    setAll(options: IRequestOptions, records: IDataRecord[]): void;
    remove(options: IRequestOptions, record: IDataRecord): void;

    register(name: string): void;

    link(record: IDataRecord): void;
    getAllElements(record: IDataRecord): IDataRecord[];
}