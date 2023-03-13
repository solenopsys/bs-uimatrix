import {Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef} from "@angular/core";

import {DeclaredService} from "@solenopsys/ui-utils";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
    selector: 'app-exhibit',
    templateUrl: './exhibit.component.html',
    styleUrls: ['./exhibit.component.scss']
})
export class ExhibitComponent {
    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) entry: ViewContainerRef;
    config: any;
    story: any;


    @Input()
    events$: Subject<string>;
    @Input()
    storyId: number;

    constructor(private ds: DeclaredService) {
    }

    @Input("data")
    set setData(data: { config: any, id: number }) {
        this.config = data.config
        this.story = data.config.stories[data.id];
        if (this.story) {
            this.ds.getComponent(data.config.package, data.config.component).then((comp: any) => {
                this.entry.clear();
                const componentRef = this.entry.createComponent(comp);
                for (const key in this.story.params) {
                    if (this.config.io[key]['type'] === "class") {
                        //@ts-ignore
                        const makeObject = this.ds.makeObject(this.story.params[key]);
                        makeObject.setData(this.story.data);
                        componentRef.instance[key] = makeObject;
                    } else if (this.config.io[key]['type'] === "Observable") {
                        const subject = new Subject();
                        componentRef.instance[key] = subject.asObservable();
                        setTimeout(t => {
                            subject.next(this.story.params[key])
                        })
                    } else {
                        componentRef.instance[key] = this.story.params[key];
                    }
                }
                Object.keys(this.config.io)
                    .filter(
                        key => this.config.io[key].directions.includes(
                            "output"
                        )
                    ).forEach(
                    output => {
                        const subscription = componentRef.instance[output].subscribe((e) => {
                            this.events$.next(e)
                            console.log('Button clicked in parent component')
                        });
                    }
                )


            })
        }
    }


}
