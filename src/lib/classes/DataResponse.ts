import IDataRecord from "../interfaces/IDataRecord";

export default class DataResponse extends Response{
    private $record: IDataRecord = null
    private $records: IDataRecord[] = []

    constructor(body?: BodyInit, response?: ResponseInit) {
        super(body, response)
    }

    public get record(): IDataRecord {
        return this.$record
    }
    public setRecord(value: IDataRecord) {
        this.$record = value
    }

    public get records(): IDataRecord[] {
        return this.$records
    }
    public setRecords(value: IDataRecord[]) {
        this.$records = value
    }
}