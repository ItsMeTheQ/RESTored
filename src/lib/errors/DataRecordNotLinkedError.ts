import type IDataRecord from "../interfaces/IDataRecord"

export default class DataRecordNotLinkedError extends Error {
    constructor(record: IDataRecord) {
        super(`The DataRecord "${record.recordType()} uuId: ${record.getUuid()}" is not linked to a DataStore`)
    }
}