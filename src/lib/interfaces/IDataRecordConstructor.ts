import type IDataRecord from "./IDataRecord"
import type IStore from "./IStore"

export default interface IDataRecordConstructor {
    new (store: IStore): IDataRecord
}
