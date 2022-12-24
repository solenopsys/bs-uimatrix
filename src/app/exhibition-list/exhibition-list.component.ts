import {Component, OnInit} from "@angular/core";
import {ButtonComponent} from "@solenopsys/uimatrix-forms";
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {URL_MAPPING_SUBJECT} from "../app.module";
import {Location} from '@angular/common';
import {filter, firstValueFrom, map, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: "app-exhibition-list",
    templateUrl: "./exhibition-list.component.html",
    styleUrls: ["./exhibition-list.component.css"]
})
export class ExhibitionListComponent implements OnInit {
    stories$: Observable<any>;

    constructor(private location: Location, private http: HttpClient ,private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let currentUrl = this.location.path();
                console.log("CONSTRUCTOR ", currentUrl)

                const name = currentUrl.split("/").pop()
                console.log("NAME ", name)
                this.stories$ = URL_MAPPING_SUBJECT.asObservable().pipe(filter(val => val != undefined)).pipe(
                    switchMap(MAPPING => {
                        let parent = MAPPING[currentUrl];

                        let url = parent + "components/" + name + ".json";
                        console.log("PARENT ", url)
                        return firstValueFrom(this.http.get<any>(url))
                    })
                ).pipe(tap(item => console.log("LOG", item)))
            }
        });
    }

    ngOnInit(): void {



    }

}
