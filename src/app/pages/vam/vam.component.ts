import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  Config,
  IonRouterOutlet,
  LoadingController,
  PopoverController
} from "@ionic/angular";

import { Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import { User} from "../account/account";
import "jquery";
import {VamPopoverPage} from "./vam-popover";
import {
  AlertController,
  ModalController,
  ToastController
} from "@ionic/angular";
import {ConferenceData} from "../../providers/conference-data";
import {UserData} from "../../providers/user-data";


@Component({
  selector: 'app-vam',
  templateUrl: './vam.component.html',
  styleUrls: ['./vam.component.scss']
})
export class VamComponent implements OnInit, OnChanges {
  static hideIframe: string;
  @Input() vamdata: User[]=  [];
  all: any;
  routerSubscription: any;


  constructor(
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public storageServive: StorageService,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public config: Config,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public user: UserData,

  ) { }

  ngOnInit(): void {
    this.getJson();
  }

  // This lifecycle method will be triggered when the Home page becomes active
  ionViewWillEnter() {
    this.getJson();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if a specific property changed
    if (changes['vamdata']) {
      const previousValue = changes['vamdata'].previousValue;
      const currentValue = changes['vamdata'].currentValue;
      console.log(`inputProp changed from ${previousValue} to ${currentValue}`);
    }
  }

  toggle($event: User) {
    this.vamdata.find(value => {
      if (value.ipAddress === $event.ipAddress) value.hide = !value.hide;
    })
  }

  async getJson() {
      await this.storageServive.getData("VAM").then((data:any) => {
        let res: User[];
          res = JSON.parse(data.value);
          this.vamdata = res
      });
  }

  getPcName(buttenName: string): string {
    const pcMatch = buttenName.match(/\d+\.\d+\.\d+\.(\d+)/);  // Matches the last octet
    const portMatch = buttenName.match(/:(\d{4})/);  // Matches the first two digits of the port (81)

    // Extract values if matches are found
    const pc = pcMatch ? pcMatch[1] : null;
    const port = portMatch ? portMatch[1].slice(-2) : null;

    let matchedText;
    if (pc && port) {
      matchedText = pc + ': ' + port;
    }
    return matchedText;
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: VamPopoverPage,
      event
    });
    await popover.present();
  }
}

