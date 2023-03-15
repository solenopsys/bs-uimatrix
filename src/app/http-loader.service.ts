import {Loader} from "./menu/types";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";




export class HttpLoader implements Loader {
    worker: Worker;

    constructor(private httpClient: HttpClient) {

    }

    load(url): Promise<any> {
       return  firstValueFrom(this.httpClient.get(url))
    }
}