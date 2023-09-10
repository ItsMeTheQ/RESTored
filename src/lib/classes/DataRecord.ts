import type IDataRecord from "../interfaces/IDataRecord"
import "reflect-metadata"
import type IStore from "../interfaces/IStore"
import type IRequestOptions from "../interfaces/IRequestOptions"
import {RequestMethods} from "./Store"
import BaseTransformer from "../transformers/BaseTransformer"
import NoPrimaryError from "../errors/NoPrimaryError"
import type ITransformer from "../interfaces/ITransformer"
import DataResponse from "./DataResponse";

let counter: number = 0

export default abstract class DataRecord implements IDataRecord {
    private uuId: number = counter++

    public uuid(): number {
        return this.uuId
    }

    public getIsNew(): boolean {
        return this.isNew
    }

    public setIsNew(isNew: boolean): void {
        this.isNew = isNew
    }

    public store: IStore

    private isNew: boolean = true

    recordType() {
        return 'basic'
    }

    url(options: IRequestOptions) {
        return 'baseUrl'
    }

    public get hasChanged(): boolean {
        let output: boolean = false
        const properties = this.getOwnDataFields()
        for (let property of properties) {
            if (this[property as keyof DataRecord].hasChanged) {
                output = true
                break
            }
        }
        return output
    }

    constructor(store: IStore) {
        this.store = store
    }

    private getOwnDataFields(): string[] {
        return Object.getOwnPropertyNames(this).filter((property: string) => {
            return property.startsWith('$') && this[property as keyof DataRecord] instanceof BaseTransformer
        })
    }

    getUuid(): number {
        return this.uuId
    }

    getPrimary(): string {
        let output: string = ''
        const properties = this.getOwnDataFields()
        for (let property of properties) {
            if (this[property as keyof DataRecord].isPrimary() === true
            ) {
                output = String([null, undefined].includes(this[property].getValue()) ? '' : this[property].serialize()).toString()
                break
            }
        }
        return output
    }

    link(): void {
        this.store.link(this.store.new.request(this.recordType()).setRecord(this))
    }

    unlink(): void {
        this.store.unlink(this)
    }

    addToStoreMapping(options: IRequestOptions, position: number): void {
        this.link()
        options.setRecord(this)
        this.store.records.addToStoreMapping(options, position)
    }

    revert(): void {
        const properties = this.getOwnDataFields()
        for (let property of properties) {
            const localAttribute: ITransformer<any> = this[property]
            localAttribute.deserialize(localAttribute.getOldValue())
        }
    }

    private fillOptionsParameters(options?: IRequestOptions): IRequestOptions {
        if (options) {
            options.setRecord(this)
        } else {
            options = this.store.new.request(this.recordType()).setRecord(this)
        }
        return options
    }

    async create(options?: IRequestOptions): Promise<DataResponse> {
        options = this.fillOptionsParameters(options)
            .setRequestMethod(RequestMethods.POST)
            .setMultiple(false)
        return await this.store.create(options)
    }

    async update(options?: IRequestOptions): Promise<DataResponse> {
        options = this.fillOptionsParameters(options)
            .setRequestMethod(RequestMethods.PUT)
            .setMultiple(false)
        return await this.store.update(options)
    }

    async delete(options?: IRequestOptions): Promise<DataResponse> {
        options = this.fillOptionsParameters(options)
            .setRequestMethod(RequestMethods.DELETE)
            .setMultiple(false)
        return await this.store.delete(options)
    }

    async save(options?: IRequestOptions): Promise<DataResponse> {
        options = this.fillOptionsParameters(options)
        if (this.hasChanged && !this.getIsNew()) {
            return await this.update(options)
        }
        return await this.create(options)
    }

    serialize(): { [key: string]: unknown } {
        let output: { [key: string]: unknown } = {}

        const properties = this.getOwnDataFields()
        for (let property of properties) {
            output[property.replace('$', '')] = this[property].serialize()
        }
        return output
    }

    deserialize(data: { [p: string]: unknown }): void {
        const properties = this.getOwnDataFields()
        for (let property of properties) {
            const replacedProperty: string = property.replace('$', '')
            const localAttribute: ITransformer<any> = this[property]
            localAttribute.deserialize(data[replacedProperty])
        }
        if (this.getPrimary() === '') {
            throw new NoPrimaryError(this)
        }
    }

    toString(): string {
        return JSON.stringify(this.serialize())
    }
}
