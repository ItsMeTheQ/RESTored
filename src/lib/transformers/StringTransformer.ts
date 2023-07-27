import BaseTransformer from "./BaseTransformer";

export default class BooleanTransformer extends BaseTransformer<String> {
    name(): string {
        return 'stringTransformer'
    }

    // return value is the JSON serialized value
    serialize(): unknown {
        return String(this.getValue());
    }

    // input value has to be valid JSON format
    // function converts input to the correct local type (json -> local)
    deserialize(input: unknown): void {
        this.setValue(String(input))
        this.setOldValue()
    }
}
