import {Component, OnInit} from '@angular/core';
import {ColorSchemesService} from "@solenopsys/ui-themes";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent  implements OnInit{
  public currentTheme: {[key:string]:string};

  constructor(private css: ColorSchemesService,private route: ActivatedRoute,) {



  }

  ngOnInit(): void {
    console.log("INIT")
    this.route.params.subscribe((nav:any)=>{
      console.log("NAV NAME",nav.theme)
      console.log("NAV DATA",this.css.schemes[nav.theme])
      this.currentTheme= this.css.schemes[nav.theme]
    })

  }
}
