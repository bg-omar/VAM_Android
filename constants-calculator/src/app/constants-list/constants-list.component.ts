import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../constants.service';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-constants-list',
  standalone: true,
  imports: [
    CdkDrag,
    NgForOf
  ],
  templateUrl: './constants-list.component.html',
  styleUrl: './constants-list.component.scss'
})
export class ConstantsListComponent implements OnInit {

  constants: any[] = [];

  constructor(private constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.constants = this.constantsService.getConstants();
  }

}
