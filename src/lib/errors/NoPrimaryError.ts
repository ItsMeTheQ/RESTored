import IDataRecord from "../interfaces/IDataRecord";

export default class NoPrimaryError extends Error {
    constructor(record: IDataRecord) {
        super(`No primary key found for record ${record.recordType()}`)
    }
}