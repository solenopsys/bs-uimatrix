import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, Routes} from "@angular/router";
import {
    BootstrapComponent,
    GridState,
    InterfaceState,
    MenuLoaderService, MenuState,
    SetLeftPanel,
    SetTabs,
    UITemplatesModule
} from "@solenopsys/ui-templates";
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
import {BehaviorSubject, Subject} from "rxjs";
import {UIControlsModule} from "@solenopsys/ui-controls";
import {UIModalsModule} from "@solenopsys/ui-modals";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {UINavigateModule} from "@solenopsys/ui-navigate";
import {UIChartsModule} from "@solenopsys/ui-charts";
import {Store} from "@ngxs/store";
import {IconMenuProvider} from "./menu/icon-menu-provider";
import {ExbeditMenuProvider} from "./menu/ex-menu-provider";
import {ThemesMenuProvider} from "./menu/themes-menu-provider";
import {ColorSchemesService} from "@solenopsys/ui-themes";

export const URL_MAPPING_SUBJECT$: BehaviorSubject<{ [key: string]: string }> =
    new BehaviorSubject<{ [p: string]: string }>(undefined);


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
        ...createNgxs(!environment.production, [ClusterState, GridState, RowsState, InterfaceState, MenuState], true),
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
    constructor(
        private http: HttpClient,
        private store: Store, menuLoaderService: MenuLoaderService,
        private colorService: ColorSchemesService) {

        menuLoaderService.addProvider("exMenuProvider", new ExbeditMenuProvider(URL_MAPPING_SUBJECT$, http))
        menuLoaderService.addProvider("iconMenuProvider", new IconMenuProvider(http))
        menuLoaderService.addProvider("themesMenuProvider", new ThemesMenuProvider(colorService))

        loadTabs(store)
        menuInit(store)


        //   ls(menuLoaderService, http)
    }
}

// async function ls(menuLoaderService: MenuLoaderService,http: HttpClient){
//     menuLoaderService.load("exMenuProvider", "menu")
//         .then((menu) => {
//         console.log("MENU", menu);
//     });
// }

async function loadTabs(store: Store) {
    store.dispatch(new SetTabs([
        {id: 'components', title: 'Components'},
        {id: 'icons', title: 'Icons'},
        {id: 'themes', title: 'Themes'},]))
}

async function menuInit(store: Store) {
    // store.dispatch(new SetLeftPanel({
    //     component: 'menu',
    //     dataProviderName: "exMenuProvider"
    // }));

    // store.dispatch(new SetLeftPanel({
    //     component: 'menu',
    //     dataProviderName: "iconMenuProvider"
    // }));

    store.dispatch(new SetLeftPanel({
        component: 'menu',
        dataProviderName: "themesMenuProvider"
    }));
}








