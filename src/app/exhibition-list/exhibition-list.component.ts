import {Component, OnDestroy, OnInit} from "@angular/core";
import {NavigationEnd, Router} from '@angular/router';
import {URL_MAPPING_SUBJECT$} from "../app.module";
import {Location} from '@angular/common';
import {filter, firstValueFrom, map, Observable, Subject, Subscription, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as json5 from 'json5';


@Component({
    selector: "app-exhibition-list",
    templateUrl: "./exhibition-list.component.html",
    styleUrls: ["./exhibition-list.component.scss"]
})
export class ExhibitionListComponent implements OnInit, OnDestroy {
    config$: Observable<any>;

    events$ = new Subject<string>()
    events: string[] = [];

    private subscription: Subscription

    constructor(private location: Location, private http: HttpClient, private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const currentUrl = this.location.path();
                console.log("CONSTRUCTOR ", currentUrl)

                const name = currentUrl.split("/").pop()
                console.log("NAME ", name)
                this.config$ = URL_MAPPING_SUBJECT$.asObservable().pipe(filter(val => val != undefined))
                    .pipe(
                        switchMap(MAPPING => {
                            console.log("PRINT MAPPING", MAPPING)
                            const parent = MAPPING[currentUrl]; // stories/charts

                            const url = parent + "components/" + name + ".json5";
                          //  console.log("PARENT ", url)
                            return firstValueFrom(this.http.get<string>(url, {
                                // @ts-ignore
                                responseType: 'text'
                            }).pipe(
                                // @ts-ignore
                                map((t: string) => json5.parse(t))))
                        })
                    )
                    .pipe(tap(item => console.log("LOG", item)))
            }
        });


    }

    ngOnInit(): void {
        this.subscription = this.events$.asObservable().subscribe(event => this.events.push(event));

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
