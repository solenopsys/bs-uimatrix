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
import {loadMenu, MenuLoader} from "./submenu.service";

const routes: Routes = [
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
        loadMenu(http, menu$, URL_MAPPING_SUBJECT)
    }
}

export const URL_MAPPING_SUBJECT: BehaviorSubject<{ [key: string]: string }> =
    new BehaviorSubject<{ [p: string]: string }>(undefined);






