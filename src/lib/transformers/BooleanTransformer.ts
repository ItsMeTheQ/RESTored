import BaseTransformer from "./BaseTransformer"

export default class BooleanTransformer extends BaseTransformer<Boolean> {
    name(): string {
        return 'booleanTransformer'
    }

    // return value is the JSON serialized value
    serialize(): unknown {
        return Boolean(this.getValue())
    }

    // input value has to be valid JSON format
    // function converts input to the correct local type (json -> local)
    deserialize(input: unknown): void {
        this.setValue(Boolean(input))
        this.setOldValue()
    }
}
