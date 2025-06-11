import { Injectable } from '@angular/core';
import {CONSTANTS} from "./constants";
import {Constant} from "./constants.type"

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constants: Constant[] = CONSTANTS;

  constructor() { }

  getConstants(): Constant[] {
    return this.constants;
  }
}
