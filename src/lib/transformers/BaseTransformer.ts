import ITransformer from "../interfaces/ITransformer"

export default abstract class BaseTransformer<T> implements ITransformer<T> {
    public name(): string {
        return 'baseTransformer'
    }

    private default: T = null
    private value: T
    private primary: boolean
    private oldValue: unknown

    get hasChanged(): boolean {
        return this.serialize() !== this.getOldValue()
    }

    getDefault(): T {
        return this.default
    }

    setDefault(value: T): BaseTransformer<T> {
        this.default = value
        this.setValue(value)
        this.setOldValue()
        return this
    }

    isPrimary(): boolean {
        return this.primary
    }

    setPrimary(): BaseTransformer<T> {
        this.primary = true
        return this
    }

    getValue(): T {
        return this.value
    }

    setValue(value: T): void {
        this.value = value
    }

    getOldValue(): unknown {
        return this.oldValue
    }

    setOldValue(): void {
        this.oldValue = this.serialize()
    }

    // return value is the JSON serialized value
    serialize(): unknown {
        return this.getValue()
    }

    // input value has to be valid JSON format
    // function converts input to the correct local type (json -> local)
    deserialize(input: unknown): void { // input value has to be valid JSON format
        this.setValue(input as T)
        this.setOldValue()
    }
}
