import IDataRecord from "../interfaces/IDataRecord";
import IRequestOptions from "../interfaces/IRequestOptions";

export default class DataStoreMapElement {
    map: Map<string, string[]>;
    list: IDataRecord[];

    private has(options: IRequestOptions): boolean {
        return this.map.has(options.getUrl());
    }

    private findRecordIndex(record: IDataRecord): number {
        return this.list.findIndex((item: IDataRecord) => {
            return item.getPrimary() === record.getPrimary()
        })
    }

    get(options: IRequestOptions): IDataRecord[] {
        if (this.has(options)) {
            let output: IDataRecord[] = [];
            for (let id in this.map.get(options.getUrl())) {
                let record: IDataRecord = this.list.find((record: IDataRecord) => {
                    return record.getPrimary() === id
                })
                if (record) {
                    output.push(record)
                }
            }
            return output;
        }
        return [];
    }

    remove(options: IRequestOptions, record: IDataRecord): void {
        if (this.has(options)) {
            for (let key in this.map.keys()) {
                while (this.map.get(key).includes(record.getPrimary())) {
                    this.map.get(key).splice(
                        this.map.get(key).indexOf(
                            record.getPrimary()
                        ), 1);
                }
            }
            let index: number = -1;
            while (true) {
                index = this.findRecordIndex(record)
                if (index === -1) {
                    break
                }
                this.list.splice(index, 1)

            }
        }
    }

    set(options: IRequestOptions, record: IDataRecord): void {
        if (this.has(options)) {
            this.map.get(options.getUrl()).push(record.getPrimary());
        } else {
            this.map.set(options.getUrl(), [record.getPrimary()]);
        }
    }

    setAll(options: IRequestOptions, records: IDataRecord[]): void {
        if (this.has(options)) {
            this.map.set(options.getUrl(), []);
        }
        records.forEach((record: IDataRecord) => {
            this.set(options, record);
        })
    }

    link(record: IDataRecord): void {
        let index: number = this.findRecordIndex(record)
        if (index === -1) {
            this.list.push(record)
        } else {
            this.list[index] = record
        }
    }
}
