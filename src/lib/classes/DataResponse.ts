import type IDataRecord from "../interfaces/IDataRecord";

export default class DataResponse{
    private $record: IDataRecord = null
    private $records: IDataRecord[] = []
    private readonly $response: Response = null

    constructor(response: Response) {
        this.$response = response
    }

    public get response(): Response {
        return this.$response
    }

    public get headers(): Headers {
        return this.$response.headers
    }
    public get ok(): boolean {
        return this.$response.ok
    }
    public get status(): number {
        return this.$response.status
    }
    public get statusText(): string {
        return this.$response.statusText
    }
    public get type(): ResponseType {
        return this.$response.type
    }
    public get url(): string {
        return this.$response.url
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