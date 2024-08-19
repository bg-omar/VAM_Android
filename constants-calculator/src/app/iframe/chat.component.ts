import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ConstantsService} from "../constants.service";
import {Constant} from "../constants.type"


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CdkDropList,
    FormsModule,
    NgForOf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
