import IDataRecord from "./IDataRecord"
import IStore from "./IStore"

export default interface IDataRecordConstructor {
    new (store: IStore): IDataRecord
}
