import { Injectable } from '@angular/core';
import {constants} from "./constants";

interface Constant {
  constant: string;
  value: number;
  uncertainty: string | number;
  unit: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  private constants: Constant[] = constants;

  constructor() { }

  getConstants(): Constant[] {
    return this.constants;
  }
}
