import BaseTransformer from "./BaseTransformer"

export default class NumberTransformer extends BaseTransformer<number> {
    name(): string {
        return 'numberTransformer'
    }

    // return value is the JSON serialized value
    serialize(): unknown {
        return this.getValue() ? Number(this.getValue()) : null
    }

    // input value has to be valid JSON format
    // function converts input to the correct local type (json -> local)
    deserialize(input: unknown): void {
        this.setValue(typeof input === 'number' ? Number(input): this.getDefault())
        this.setOldValue()
    }
}
