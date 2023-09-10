import type IDataRecord from "../interfaces/IDataRecord"

export default class DataRecordNotRegistered extends Error {
    constructor(record: IDataRecord) {
        super(`The DataRecord "${record.recordType()} uuId: ${record.getUuid()}" is not registered in DataStore`)
    }
}