import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, Routes} from "@angular/router";
import {BootstrapComponent, GridState, UITemplatesModule} from "@solenopsys/ui-templates";
import {createNgxs} from "@solenopsys/fl-storage";
import {RowsState, UIListsModule} from "@solenopsys/ui-lists";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';


import {
    ExhibitFreeSelectComponent,
    ExhibitFreeSelectSaveComponent,
    ExhibitIconButtonComponent,
    ExhibitInfinityTableComponent,
    ExhibitModalComponent,
    ExhibitPathTreeComponent,
    ExhibitSelectEntityComponent,
    ExhibitSubMenuComponent,
    ExhibitTopPanelComponent,
    ExhibitTreeComponent
} from "./comps";

import {ExhibitionListComponent} from "./exhibition-list/exhibition-list.component";
import {ExhibitComponent} from "./exhibit/exhibit.component";
import {environment} from "../environments/environment";
import {BlockChainComponent} from "./block-chain/block-chain.component";
import {UIIconsModule} from "@solenopsys/ui-icons";
import {ClusterState} from "@solenopsys/fl-clusters";
import {BehaviorSubject, firstValueFrom, Subject} from "rxjs";
import {UIControlsModule} from "@solenopsys/ui-controls";
import {UIModalsModule} from "@solenopsys/ui-modals";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {UINavigateModule} from "@solenopsys/ui-navigate";
import {UIChartsModule} from "@solenopsys/ui-charts";

const routes: Routes = [

    // {path: "docs", component: TextPageComponent, data: {uid: "0x3d223"}},
    // {path: "blockchain", component: BlockChainComponent},
    {
        path: "components", component: ExhibitionListComponent,
        children: [{
            path: "**", component: ExhibitComponent
        }]
    }
];

const menu$ = new Subject()
const tabs$ = new Subject<{ id: string, title: string }[]>();

setTimeout(() => {
    tabs$.next([
        {id: "components", title: "Components"},
        {id: "icons", title: "Icons"},
        {id: "themes", title: "Themes"}
        ,])
})


export const PROVIDERS_CONF = [
    {provide: "assets_dir", useValue: ""},
    {provide: "mod_name", useValue: "exhibition"},
    {provide: 'single_start', useValue: true},
    {provide: 'logo', useValue: "matrix"},
    {provide: 'menu', useValue: menu$.asObservable()},
    {provide: 'tabs', useValue: tabs$.asObservable()},
];


@NgModule({
    imports: [

        HttpClientModule,
        CommonModule,
        BrowserModule,
        UIListsModule,
        UIControlsModule,
        UINavigateModule,
        UIFormsModule,
        UIIconsModule,
        UIModalsModule,
        UITemplatesModule,
        UIChartsModule,
        RouterModule.forRoot(routes),
        ...createNgxs(!environment.production, [ClusterState, GridState, RowsState,], true),
    ],
    providers: [...PROVIDERS_CONF],
    declarations: [
        ExhibitSubMenuComponent,
        ExhibitSelectEntityComponent,
        ExhibitTopPanelComponent,
        ExhibitTreeComponent,
        ExhibitFreeSelectSaveComponent,
        ExhibitFreeSelectComponent,
        ExhibitModalComponent,
        ExhibitIconButtonComponent,
        ExhibitPathTreeComponent,
        ExhibitInfinityTableComponent,
        ExhibitionListComponent,
        ExhibitComponent,
        BlockChainComponent
    ],
    bootstrap: [BootstrapComponent]
})
export class AppModule {
    constructor(private http: HttpClient) {
        loadMenu(http)
    }


}

const URL_MAPPING: { [key: string]: string } = {}
export const URL_MAPPING_SUBJECT: BehaviorSubject<{ [key: string]: string }> = new BehaviorSubject<{ [p: string]: string }>(undefined);

async function loadMenu(http: HttpClient) {
    console.log("LOAD MAIN MENU START")
    firstValueFrom(http.get<any[]>(`/assets/menu.json`)).then((menuItems: MenuItem[]) => {

        let forLoad = menuItems.filter(item => item.submenus != undefined);
        const jobs = []
        for (const item of forLoad) {
            let promises = loadSubmenu(item, http);
            jobs.push(...promises)
        }
        Promise.all(jobs).then(result => {
            console.log("MENU AFTER LOAD", JSON.stringify(menuItems));
            menu$.next(menuItems);
            URL_MAPPING_SUBJECT.next(URL_MAPPING)
        })
    })
}


function loadSubmenu(item: MenuItem, http: HttpClient): Promise<void>[] {
    const jobs = []
    item.items = []
    console.log("LOAD SUBMENU START ", item)
    for (const submenu of item.submenus) {
        let promise = firstValueFrom(http.get<any[]>(submenu + "index.json")).then((resp: any[]) => {
            const subm = resp.map(subItem => {
                let uri = item.link + "/" + subItem.name;
                URL_MAPPING[uri] = submenu
                return {
                    "name": subItem.title,
                    "link": uri,
                    "icon": "/assets/icons/04-Programing-Apps-Websites/02-Plugins-Modules/module-four.svg",
                }

            })

            item.items.push(...subm)
        });
        jobs.push(promise)
    }

    console.log("URL_MAPPING", URL_MAPPING)
    return jobs
}


interface MenuItem {
    name: string;
    link: string;
    icon: string;
    submenus: string[]
    items: any[]
}


