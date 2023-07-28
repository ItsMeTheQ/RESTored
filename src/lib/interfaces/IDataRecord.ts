import IRequestOptions from "../interfaces/IRequestOptions"
import IStore from "./IStore"

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

    create(options: IRequestOptions): Promise<Response>
    update(options: IRequestOptions): Promise<Response>
    delete(options: IRequestOptions): Promise<Response>

    save(options: IRequestOptions): Promise<Response>

    addToStoreMapping(options: IRequestOptions, position: number): void
}
