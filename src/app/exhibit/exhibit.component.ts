import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";

import {DeclaredService} from "@solenopsys/uimatrix-utils";


@Component({
    selector: 'app-exhibit',
    templateUrl: './exhibit.component.html',
    styleUrls: ['./exhibit.component.css']
})
export class ExhibitComponent implements OnInit {
    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) entry: ViewContainerRef;
    data: any;

    constructor(private ds: DeclaredService, private resolver: ComponentFactoryResolver) {
    }



    @Input("data")
    set setData(data: any) {
        this.data = data
        console.log("SET DATA", data);
        this.ds.getComponent(data.package, data.component).then((comp: any) => {
                this.entry.clear();
                const factory = this.resolver.resolveComponentFactory(comp);
                const componentRef = this.entry.createComponent(factory);
                componentRef.instance['title'] = "ok1";

                // componentRef.instance.title = 'Hello World!';
                // componentRef.instance.message = 'This is a dynamic component';
            }
        )


    }


    ngOnInit(): void {
    }

}
