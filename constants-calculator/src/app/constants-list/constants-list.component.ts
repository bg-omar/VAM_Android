import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ConstantsService } from '../constants.service';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgForOf} from "@angular/common";
import {Constant} from "../constants.type"
import {CONSTANTS} from "../constants";

@Component({
  selector: 'app-constants-list',
  standalone: true,
  imports: [
    CdkDrag,
    NgForOf
  ],
  templateUrl: './constants-list.component.html',
  styleUrls: ['./constants-list.component.scss']
})
export class ConstantsListComponent implements OnInit {

  @Output() constantSelected = new EventEmitter<any>();
  constants: Constant[] = CONSTANTS;



  constructor(private constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.constants = this.constantsService.getConstants();
  }

  selectConstant(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const constantName = selectElement.value;
    const selectedConstant = this.constants.find(c => c.constant === constantName);
    if (selectedConstant) {
      this.constantSelected.emit(selectedConstant);
    }
  }
}
