import {Loader} from "./types";

export class HttpWebWorkerLoader implements Loader {
    worker: Worker;

    constructor() {
        // @ts-ignore
        this.worker = new Worker(new URL('./load-components-menu.worker', import.meta.url));

    }

    load(url): Promise<any> {
        console.log("START LOAD")
        return new Promise((resolve, reject) => {
            this.worker.onmessage = ({data}) => {
                resolve(data);
            };
            this.worker.onerror = (error) => {
                reject(error);
            };

            this.worker.postMessage(url);
        });
    }
}
