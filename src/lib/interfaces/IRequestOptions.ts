import IDataRecord from "./IDataRecord";
import {RequestMethods} from "../classes/Store";

export default interface IRequestOptions {
    record: IDataRecord;
    queries: Map<string, string>;
    params: Map<string, string>;
    headers: Headers;

    setRequestMethod(method: RequestMethods): IRequestOptions;
    getRequestMethod(): RequestMethods;

    setMultiple(multiple: boolean): IRequestOptions;
    getMultiple(): boolean;

    setRecord(record: IDataRecord): IRequestOptions;
    addQuery(key: string, value: string): IRequestOptions;
    addParam(key: string, value: string): IRequestOptions;
    addHeader(key: string, value: string): IRequestOptions;

    getQueries(): Map<string, string>;
    getQuery(key: string): string;

    getParams(): Map<string, string>;
    getParam(key: string): string;

    getHeaders(): Headers;
    getHeader(key: string): string;

    getRecordType(): string;
    getPrimary(): string;

    getUrl(): string;
    getUrlWithParams(): string;
}
