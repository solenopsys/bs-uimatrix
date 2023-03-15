import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MenuItem} from "./types";
import {HttpLoader} from "../http-loader.service";
import {MenuResolver} from "./submenu.service";
import {MenuLoaderProvider} from "@solenopsys/ui-templates";

export class ExbeditMenuProvider implements MenuLoaderProvider {
    constructor(private mapping$: Subject<any>, private httpClient: HttpClient) {

    }

    load(dataKey: string): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {
            const menuLoader = new MenuResolver(new HttpLoader(this.httpClient), this.mapping$)
            menuLoader.loadMenu().then(menu => {
                resolve(menu);
            })
        });
    }


}