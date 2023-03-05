import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Subject} from "rxjs";

const URL_MAPPING: { [key: string]: string } = {}


interface MenuItem {
    name: string;
    link: string;
    icon: string;
    submenus: string[]
    items: any[]
}

export interface Loader {
    load(url: string): Promise<any>
}


const STORY_ICON = "/assets/icons/04-Programing-Apps-Websites/02-Plugins-Modules/module-four.svg";

export class MenuLoader {
    submenuJobs: Promise<void>[] = [];

    constructor(private loader: Loader, private menu$: Subject<any>, private url_mapping$: Subject<any>) {

    }

    private loadSubitems(item: MenuItem): Promise<void>[] {
        const jobs = []
        item.items = []
        console.log("LOAD SUBMENU START ", item)
        for (const submenu of item.submenus) {
            const promise = this.extracted(submenu, item);
            jobs.push(promise)
        }

        console.log("URL_MAPPING", URL_MAPPING)
        return jobs
    }

    private extracted(submenu: string, item: MenuItem) {
        const promise = this.loader.load(submenu + "index.json").then((resp: any[]) => {
            const subm = resp.map(subItem => {
                const uri = item.link + "/" + subItem.name;
                URL_MAPPING[item.link] = submenu
                URL_MAPPING[uri] = submenu
                return {"name": subItem.title, "link": uri, "icon": STORY_ICON,}
            })
            item.items.push(...subm)
        });
        return promise;
    }

    loadSubmenus(): Promise<any> {
       return  Promise.all(this.submenuJobs).then(result => {
            this.url_mapping$.next(URL_MAPPING)
        })
    }

    loadMenu(): Promise<any> {
        console.log("LOAD MAIN MENU START")
        return this.loader.load("/assets/menu.json").then( (menuItems: MenuItem[]) => {
            const forLoad = menuItems.filter(item => item.submenus != undefined);
            this.submenuJobs = []
            for (const item of forLoad) {
                const promises = this.loadSubitems(item);
                this.submenuJobs.push(...promises)
            }

            console.log("MENU AFTER LOAD", JSON.stringify(menuItems));
            this.menu$.next(menuItems);
            const newVar =   this.loadSubmenus();

            console.log("LOAD MAIN MENU END", newVar)
        })
    }

}

class HttpLoader implements Loader {
    constructor(private http: HttpClient) {
    }

    load(url): Promise<any> {
        return firstValueFrom(this.http.get<any[]>(url))
    }
}


export function loadMenu(http: HttpClient,menu$:Subject<any>,mapping$: Subject<any>){
    const menuLoader = new MenuLoader(new HttpLoader(http),menu$ , mapping$)
    menuLoader.loadMenu()
}









