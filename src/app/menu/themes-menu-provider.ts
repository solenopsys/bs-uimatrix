import {MenuItem} from "./types";
import {MenuLoaderProvider} from "@solenopsys/ui-templates";
import {ColorSchemesService} from "@solenopsys/ui-themes";

export class ThemesMenuProvider implements MenuLoaderProvider {
    constructor(private colorSchemeService: ColorSchemesService) {

    }

    load(dataKey: string): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {
            const res = Object.keys(this.colorSchemeService.schemes).map((key) => {
                return {link:"/themes/"+  key, name: key} as MenuItem;
            })


            resolve(res);

        });
    }


}