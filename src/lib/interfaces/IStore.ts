import IDataRecord from "../interfaces/IDataRecord";
import IRequestOptions from "../interfaces/IRequestOptions";
import Store from "../classes/Store";
import {NewBuilder} from "../classes/Store";
import IDataStore from "./IDataStore";


export default interface IStore {
    defaultHeaders: Map<string, string>;
    records: IDataStore
    new: NewBuilder;

    addHeader(key: string, value: string): IStore;
    removeHeader(key: string): IStore;

    register(record: new () => IDataRecord): Store;

    getSingle(options: IRequestOptions): IDataRecord;
    get(options: IRequestOptions): IDataRecord[];

    link(options: IRequestOptions): void
    unlink(record: IDataRecord): void

    find(options: IRequestOptions): Promise<Response>;
    findAll(options: IRequestOptions): Promise<Response>;

    create(options: IRequestOptions): Promise<Response>;
    update(options: IRequestOptions): Promise<Response>;
    delete(options: IRequestOptions): Promise<Response>;
}
