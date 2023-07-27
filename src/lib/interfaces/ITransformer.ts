export default interface ITransformer<T> {
    hasChanged: boolean;

    name(): string;

    serialize(): unknown; // value has to be JSON serializable
    deserialize(input: unknown): void;

    isPrimary(): boolean;
    setPrimary(): ITransformer<T>;

    getDefault(): T;
    setDefault(value: T): ITransformer<T>;

    getValue(): T;
    setValue(value: T): void;

    getOldValue(): unknown;
    setOldValue(): void;
}
