/// <reference lib="webworker" />

import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

addEventListener('message', async ({data}) => {
    console.log("INSIDE IN WORKDER", data)

    try {
        // make an HTTP request using the Fetch API
        const response = await fetch(data);


        // convert the response to JSON
        const json = await response.json();

        // send the result back to the main thread
        postMessage(json);
    } catch (error) {
        // send the error back to the main thread
        postMessage({ error: error.message });
    }

});
