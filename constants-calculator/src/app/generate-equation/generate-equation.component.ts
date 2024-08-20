
import {Equation, EquationTerm} from "../constants.type";
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogActions} from '@angular/material/dialog';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-com.html',
  imports: [
    MatButton,
    MatDialogActions,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class DialogComDialog {
  terms: EquationTerm[] = [];
  selectedIndex: number = -1;
  type: 'variable' | 'constant' | 'operator' | undefined;
  formData: any = {}

  operators = [
    { symbol: "*", precedence: 3 },
    { symbol: "/", precedence: 3 },
    { symbol: "+", precedence: 2 },
    { symbol: "-", precedence: 2 },
    { symbol: "(", precedence: 4 },
    { symbol: ")", precedence: 4 },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogComDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.type = data.e.target.value
    this.selectedIndex = data.i;
    this.terms = data.terms
  }

  onNoClick(): void {
    this.dialogRef.close(this.formData);
  }

  changeTerm(e: any){
    this.formData = e.target.value;
  }
}

@Component({
  selector: 'app-generate-equation',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatMenuTrigger,
    MatMenu,
    NgIf,
    DialogComDialog
  ],
  templateUrl: './generate-equation.component.html',
  styleUrl: './generate-equation.component.scss'
})
export class GenerateEquationComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  lhs: string = "";
  rhs: string = "";
  rhsCode: string = "";
  see: boolean = false;
  result: number = 0;

  terms: EquationTerm[] = [
    {
      type:'variable',
      name: 'abcd',
      code: 'ABCD',
      value: undefined
    },
    {
      type:'variable',
      name: 'pqrs',
      code: 'PQRS',
      value: undefined
    }
  ];
  selectedIndex: number = -1;
  type: 'variable' | 'constant' | 'operator' | undefined;

  title = 'equationGenerator';
  equation: Equation = {terms: []}

  testingValues: EquationTerm[] = []

  constructor(public dialog: MatDialog){}


  ngOnInit(): void {
    this.equation = {terms: [
        {
          type: 'operator',
          value: "(",
          name: "(",
          code: undefined
        },
        {
          type: 'operator',
          value: ")",
          name: ")",
          code: undefined
        }
      ]}
  }
  addTerm(){
    this.terms.push(new EquationTerm())
  }

  removeTerm(i: number){
    this.terms.splice(i,1)
  }

  create(){
    this.generateEquation();
    this.see = true;
  }

  changeType(e: any,i: number){
    if(e.target.value === 'remove'){
      this.equation.terms.splice(this.selectedIndex+1, 1);
    }else{
      this.type = e.target.value
      this.selectedIndex = i;

      const dialogRef = this.dialog.open(DialogComDialog, {
        data: {e: e, i: i, terms: this.terms},
      });

      dialogRef.afterClosed().subscribe(result => {
        switch(this.type){
          case 'variable':
            this.equation.terms.splice(this.selectedIndex+1, 0, {
              type: this.type,
              name: result,
              code: result+"".toUpperCase().replace(' ', '_'),
              value: undefined
            })
            break;
          case 'operator':
            this.equation.terms.splice(this.selectedIndex+1, 0, {
              type: this.type,
              name: result,
              code: undefined,
              value: result
            })
            break;
          case 'constant':
            this.equation.terms.splice(this.selectedIndex+1, 0, {
              type: this.type,
              name: result,
              code: undefined,
              value: result
            })
            break;
        }
      });
    }
  }

  changeTerm(e: any){
    this.equation.terms.splice(this.selectedIndex+1, 0, {
      type: this.type,
      name: undefined,
      code: undefined,
      value: undefined
    })
  }

  test(){
    this.testingValues = this.terms;
  }

  generateEquation() {
    let equationString = '';

    for (let i = 0; i < this.equation.terms.length; i++) {
      const term = this.equation.terms[i];

      if (term.type === 'variable') {
        equationString += " " + term.code + " ";
      } else {
        equationString += term.value;
      }
    }
    this.rhs = equationString;
    let temp = this.rhs;
    this.terms.forEach(term => {
      if(term.name && term.code){
        temp = temp.replace(term.name, term.code);
      }
    })
    this.rhsCode = temp;
    // console.log(equationString)
    // equationString = equationString.replace("abc", "32")
    // equationString = equationString.replace("BCD", "2")
    // console.log(equationString)
    // let numerator = eval(equationString);
    // console.log(numerator)
  }

  calculate(){
    let temp = this.rhsCode;
    this.testingValues.forEach(t => {
      if(t.code && t.value){
        temp = temp.replace(t.code, t.value);
      }
    })
    let numerator = eval(temp);
    this.result = numerator;
  }
}

