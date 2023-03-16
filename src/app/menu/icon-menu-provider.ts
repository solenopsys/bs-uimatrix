import {firstValueFrom, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MenuItem} from "./types";
import {HttpLoader} from "../http-loader.service";
import {MenuResolver} from "./submenu.service";
import {MenuLoaderProvider} from "@solenopsys/ui-templates";

export class IconMenuProvider implements MenuLoaderProvider {
    constructor(private httpClient: HttpClient) {

    }

    load(dataKey: string): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {


            firstValueFrom(this.httpClient.get('/assets/icons/index.json')).then(icons => {
                const res = Object.entries(icons).map((entry: any) => {
                    const name = entry[0].replace(/[-\d]/g, " ");
                    return {link: "/icons/" + entry[0], name} as MenuItem;
                });

                resolve(res);
            });
        });
    }


}