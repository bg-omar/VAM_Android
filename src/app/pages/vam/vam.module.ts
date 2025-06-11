import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { VamComponent } from './vam.component';
import { VamRoutingModule } from './vam-routing.module';
import { VamPopoverPage } from './vam-popover';
import {HexatrailComponent} from "../../hexatrail/hexatrail.component";
import {AccountModule} from "../account/account.module";

import {IframeComponent} from "../../iframe/iframe.component";
import {IFrameToggler} from "../../iframe/iframe-toggler.component";






@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VamRoutingModule,
    FormsModule,
    IonicModule,
    IonicModule,
    HexatrailComponent,
    AccountModule,
    IframeComponent,
    IFrameToggler,
  ],
  declarations: [
    VamComponent, VamPopoverPage
  ],
  bootstrap: [VamComponent]
})
export class VamModule { }
