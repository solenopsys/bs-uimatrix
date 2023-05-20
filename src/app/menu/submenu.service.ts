import {Subject} from "rxjs";
import {Loader,  STORY_ICON, URL_MAPPING} from "./types";
import {MenuItem} from "@solenopsys/ui-navigate";

function wrapItem(item: MenuItem): (subm: []) => void {
    return function (subm: []): void {
        console.log("NEW SUBMENU", item)
        console.log("NEW SUBMENU", subm)
    };
}


export class MenuResolver {
    submenuJobs: Promise<MenuItem[]>[] = [];

    constructor(private loader: Loader, private url_mapping$: Subject<any>) {

    }

    private loadSubitems(item: MenuItem): Promise<MenuItem[]>[] {
        const jobs = []
        item.items = []

        for (const submenu of item.submenus) {
            // console.log("PARENT ", item)

            const promise = this.extracted(submenu, item.link, item);
            jobs.push(promise)
        }

        //   console.log("URL_MAPPING", URL_MAPPING)
        return jobs
    }

    private extracted(submenu: string, parentLink: string, item: MenuItem): Promise<void> {

        const promise = this.loader.load(submenu + "index.json").then((resp: any[]) => {
            const subm = resp.map(subItem => {
                // console.log("SUBITEM", subItem);
                const uri = parentLink + "/" + subItem.name;
                URL_MAPPING[parentLink] = submenu
                URL_MAPPING[uri] = submenu
                return {"name": subItem.title, "link": uri, "icon": STORY_ICON,}
            })
            //console.log("SUMSUB", subm);
            item.items?.push(...subm)
        });
        return promise;
    }

    loadMenu(): Promise<MenuItem[]> {
        console.log("LOAD MAIN MENU START")

        return new Promise<any>((resolve, reject) => {
            this.loader.load("/assets/menu.json").then(menuItems => {
                const forLoad = menuItems.filter(item => item.submenus != undefined);
                this.submenuJobs = []
                for (const item of forLoad) {
                    const promises = this.loadSubitems(item);
                    this.submenuJobs.push(...promises)
                }

                const newVar = Promise.all(this.submenuJobs)
                    .then(result => {
                        this.url_mapping$.next(URL_MAPPING)
                        resolve(menuItems)
                    })
            }).catch(err => {
                reject(err)
            })
        })
    }

}














