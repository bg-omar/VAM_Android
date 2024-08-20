export interface Constant {
  constant: string;
  value: number;
  uncertainty: string | number;
  unit: string;
  symbol: string;
}

export class EquationTerm {
  type: 'variable' | 'constant' | 'operator' | undefined;
  name: string | undefined ;
  code: string | undefined ;
  value: string | undefined;
}

export interface Equation {
  terms: EquationTerm[];
}
