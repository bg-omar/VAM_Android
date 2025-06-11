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
import {VlcPopoverPage} from "./vlc-popover";
import {
  AlertController,
  ModalController,
  ToastController
} from "@ionic/angular";
import {ConferenceData} from "../../providers/conference-data";
import {UserData} from "../../providers/user-data";


@Component({
  selector: 'app-vlc',
  templateUrl: './vlc.component.html',
  styleUrls: ['./vlc.component.scss']
})
export class VlcComponent implements OnInit, OnChanges {
  static hideIframe: string;
  @Input() vlcdata: User[]=  [];
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
    if (changes['vlcdata']) {
      const previousValue = changes['vlcdata'].previousValue;
      const currentValue = changes['vlcdata'].currentValue;
      console.log(`inputProp changed from ${previousValue} to ${currentValue}`);
    }
  }

  toggle($event: User) {
    this.vlcdata.find(value => {
      if (value.ipAddress === $event.ipAddress) value.hide = !value.hide;
    })
  }

  async getJson() {
      await this.storageServive.getData("VLC").then((data:any) => {
        let res: User[];
          res = JSON.parse(data.value);
          this.vlcdata = res
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
      component: VlcPopoverPage,
      event
    });
    await popover.present();
  }
}

