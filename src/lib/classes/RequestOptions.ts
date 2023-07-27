import IRequestOptions from "../interfaces/IRequestOptions";
import IDataRecord from "../interfaces/IDataRecord";
import {RequestMethods} from "./Store";

export default class RequestOptions implements IRequestOptions {
    record: IDataRecord;

    headers: HeadersInit = new Headers();
    params: Map<string, string> = new Map<string, string>();
    queries: Map<string, string>;

    private method: RequestMethods = RequestMethods.GET;
    private multiple: boolean = true;

    setRequestMethod(method: RequestMethods): IRequestOptions {
        this.method = method
        return this
    }

    getRequestMethod(): RequestMethods {
        return this.method
    }

    setMultiple(multiple: boolean): IRequestOptions {
        this.multiple = multiple
        return this
    }

    getMultiple(): boolean {
        return this.multiple
    }

    setRecord(record: IDataRecord): IRequestOptions {
        this.record = record
        return this
    }

    addHeader(key: string, value: string): IRequestOptions {
        this.headers[key] = value
        return this
    }

    addParam(key: string, value: string): IRequestOptions {
        this.params.set(key, value)
        return this
    }

    addQuery(key: string, value: string): IRequestOptions {
        this.queries.set(key, value)
        return this
    }

    getHeaders(): HeadersInit {
        return this.headers
    }

    getHeader(key: string): string {
        return this.headers[key]
    }

    getParams(): Map<string, string> {
        return this.params
    }

    getParam(key: string): string {
        return this.params.get(key)
    }

    getQueries(): Map<string, string> {
        return this.queries;
    }

    getQuery(key: string): string {
        return this.queries.get(key);
    }

    getRecordType(): string {
        return this.record.recordType();
    }

    private getQueryParams(): string {
        let params: string = '?'
        this.queries.forEach((value: string, key: string) => {
            params += `${key}=${value}&`
        })
        return params
    }

    getUrl(): string {
        return this.getMultiple() ? `${this.record.url(this)}` : `${this.record.url(this)}/${this.record.getPrimary()}`;
    }

    getUrlWithParams(): string {
        return `${this.getUrl()}${this.getQueryParams()}`
    }

    getPrimary(): string {
        return this.record.getPrimary();
    }

}