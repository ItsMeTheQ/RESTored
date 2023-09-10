import type IRequestOptions from "../interfaces/IRequestOptions"
import type IStore from "./IStore"
import DataResponse from "../classes/DataResponse";

export default interface IDataRecord {
    store: IStore
    hasChanged: boolean
    getIsNew(): boolean
    setIsNew(isNew: boolean): void
    getUuid(): number

    getPrimary() : string
    recordType() : string
    url(options: IRequestOptions) : string

    unlink() : void
    link() : void
    revert() : void

    serialize(): { [key: string]: unknown}
    deserialize(data: { [key: string]: unknown}): void

    toString() : string

    create(options: IRequestOptions): Promise<DataResponse>
    update(options: IRequestOptions): Promise<DataResponse>
    delete(options: IRequestOptions): Promise<DataResponse>

    save(options: IRequestOptions): Promise<DataResponse>

    addToStoreMapping(options: IRequestOptions, position: number): void
}
