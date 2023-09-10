import type IDataRecord from "../interfaces/IDataRecord"
import type IRequestOptions from "../interfaces/IRequestOptions"

export default class DataStoreMapElement {
    map: Map<string, string[]> = new Map<string, string[]>()
    list: IDataRecord[] = []

    private has(options: IRequestOptions): boolean {
        return this.map.has(options.getUrl())
    }

    private findRecordIndex(record: IDataRecord): number {
        return this.list.findIndex((item: IDataRecord) => {
            return item.getPrimary() === record.getPrimary()
        })
    }

    get(options: IRequestOptions): IDataRecord[] {
        if (this.has(options)) {
            let output: IDataRecord[] = []
            for (let id of (this.map.get(options.getUrl()))) {
                let record: IDataRecord = this.list.find((record: IDataRecord) => {
                    return record.getPrimary() === id
                })
                if (record) {
                    output.push(record)
                }
            }
            return output
        }
        return []
    }

    remove(options: IRequestOptions): void {
        for (let key of Array.from(this.map.keys())) {
            while (this.map.get(key).includes(options.record.getPrimary())) {
                this.map.get(key).splice(
                    this.map.get(key).indexOf(
                        options.record.getPrimary()
                    ), 1)
            }
        }
        let index: number = -1
        while (true) {
            index = this.findRecordIndex(options.record)
            if (index === -1) {
                break
            }
            this.list.splice(index, 1)
        }
    }

    set(options: IRequestOptions): void {
        // TODO: Replace if inserted already
        if (this.has(options)) {
            const index: number = this.map.get(options.getUrl()).findIndex(e => e === options.record.getPrimary())
            if (index === -1) {
                this.map.get(options.getUrl()).push(options.record.getPrimary())
            }
        } else {
            this.map.set(options.getUrl(), [options.record.getPrimary()])
        }
        this.link(options)
    }

    setAll(options: IRequestOptions, records: IDataRecord[]): void {
        if (this.has(options)) {
            this.map.set(options.getUrl(), [])
        }
        records.forEach((record: IDataRecord) => {
            options.record = record
            this.set(options)
        })
    }

    link(options: IRequestOptions): void {
        let index: number = this.findRecordIndex(options.record)
        if (index === -1) {
            this.list.push(options.record)
        } else {
            this.list.splice(index, 1, options.record)
        }
    }
}
