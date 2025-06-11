import { Component } from '@angular/core';
import {VamComponent} from "../vam/vam.component";
import {IonicModule} from "@ionic/angular";
import {IFrameToggler} from "../../iframe/iframe-toggler.component";

@Component({
  standalone: true,
  imports: [
    IonicModule,
    IFrameToggler
  ],
  templateUrl: 'tabs-page.html'
})
export class TabsPage {

}
