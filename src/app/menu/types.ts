

export const STORY_ICON = "/assets/icons/04-Programing-Apps-Websites/02-Plugins-Modules/module-four.svg";
export const URL_MAPPING: { [key: string]: string } = {}




export interface Loader {
    load(url: string): Promise<any>
}


