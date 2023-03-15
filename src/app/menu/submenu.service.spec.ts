
import {Subject} from "rxjs";
import {Loader} from "./types";
import {MenuResolver} from "./submenu.service";

const meny_json = "[\n" +
    "  {\n" +
    "    \"name\": \"Charts\",\n" +
    "    \"link\": \"/components/charts\",\n" +
    "    \"icon\": \"/assets/icons/06-Business-Products/12-Analytics/analytics-bars.svg\",\n" +
    "    \"submenus\": [\n" +
    "      \"/assets/stories/charts/\"\n" +
    "    ]\n" +
    "  },\n  " +
    "  {\n" +
    "    \"name\": \"Controls\",\n" +
    "    \"link\": \"/components/controls\",\n" +
    "    \"icon\": \"/assets/icons/03-Computers-Devices-Electronics/07-Tablets-Kindle/kindle-hold.svg\",\n" +
    "    \"submenus\": [\n" +
    "      \"/assets/stories/controls/\"\n" +
    "    ]\n" +
    "  }" +
    "]\n"

const charts_json = "[\n" +
    "  {\n" +
    "    \"title\": \"Chart\",\n" +
    "    \"name\": \"ui-chart\"\n" +
    "  }\n" +
    "]"

const controls_json = "[\n" +
    "  {\n" +
    "    \"title\": \"Button\",\n" +
    "    \"name\": \"ui-button\"\n" +
    "  },\n" +
    "  {\n" +
    "    \"title\": \"Button Group\",\n" +
    "    \"name\": \"ui-button-group\"\n" +
    "  }\n" +
    "]\n" +
    "\n" +
    "\n"

class MoscLoader implements Loader {
    public queries: string[] = [];
    mockData: { [key: string]: any } = {
        "/assets/menu.json": meny_json,
        "/assets/stories/charts/index.json": charts_json,
        "/assets/stories/controls/index.json": controls_json
    }

    load(url: string): Promise<any> {
        this.queries.push(url);
        console.log("MOCK LOAD", url)
        return Promise.resolve(JSON.parse(this.mockData[url]))
    }
}


describe('MenuLoader', () => {


    let dataLoader: MoscLoader;
    let menuResolver: MenuResolver;
    const url_mapping$ = new Subject<any>();


    let url_mapping: any;

    beforeEach(async () => {
        dataLoader = new MoscLoader();
        menuResolver = new MenuResolver(dataLoader,  url_mapping$);
    });



    url_mapping$.subscribe(value => {
        url_mapping = value;
    })


    test('should create', async () => {
        expect(menuResolver).toBeTruthy();

        const menu = await menuResolver.loadMenu()
        expect(dataLoader.queries).toContain("/assets/menu.json");
        expect(dataLoader.queries).toContain("/assets/stories/charts/index.json");
        expect(dataLoader.queries).toContain("/assets/stories/controls/index.json");

        expect(menu.length).toBe(2);

        expect(url_mapping).toBeTruthy();
        expect(url_mapping["/components/charts"]).toBe("/assets/stories/charts/")
        expect(url_mapping["/components/charts/ui-chart"]).toBe("/assets/stories/charts/")
        expect(url_mapping["/components/controls"]).toBe("/assets/stories/controls/")
        expect(url_mapping["/components/controls/ui-button"]).toBe("/assets/stories/controls/")
        expect(url_mapping["/components/controls/ui-button-group"]).toBe("/assets/stories/controls/")
    });
});
