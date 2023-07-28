import BaseTransformer from "./BaseTransformer";

export default class BooleanTransformer extends BaseTransformer<string> {
    name(): string {
        return 'stringTransformer'
    }

    // return value is the JSON serialized value
    serialize(): unknown {
        return this.getValue() ? String(this.getValue()) : null;
    }

    // input value has to be valid JSON format
    // function converts input to the correct local type (json -> local)
    deserialize(input: unknown): void {
        this.setValue(input ? String(input): this.getDefault())
        this.setOldValue()
    }
}
