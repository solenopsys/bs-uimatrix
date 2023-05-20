import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HttpLoader} from "../http-loader.service";
import {MenuResolver} from "./submenu.service";
import {MenuLoaderProvider} from "@solenopsys/ui-templates";
import {MenuItem} from "@solenopsys/ui-navigate";

export class ExbeditMenuProvider implements MenuLoaderProvider {
    constructor(private mapping$: Subject<any>, private httpClient: HttpClient) {

    }

    load(dataKey: string): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {

            // todo HttpWebWorkerLoader
            const menuLoader = new MenuResolver(new HttpLoader(this.httpClient), this.mapping$)
            menuLoader.loadMenu().then(menu => {
                resolve(menu);
            })
        });
    }


}