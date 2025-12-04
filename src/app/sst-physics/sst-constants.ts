// sst-constants.ts

export interface SSTConstant {
  symbol: string;
  value: number;
  unit: string;
  description: string;
  uncertainty: string;
}

export const sstConstants: Record<string, SSTConstant> = {
  // --- Primary SST Parameters ---
  v_swirl: {
    symbol: "v_{\\circlearrowleft}",
    value: 1.09384563e6,
    unit: "m s^-1",
    description: "Characteristic Swirl Speed",
    uncertainty: "exact",
  },
  r_c: {
    symbol: "r_c",
    value: 1.40897017e-15,
    unit: "m",
    description: "Swirl Core Radius",
    uncertainty: "exact",
  },
  rho_core: {
    symbol: "\\rho_\\text{core}",
    value: 3.8934358266918687e18,
    unit: "kg m^-3",
    description: "Vortex Core Mass-Equivalent Density",
    uncertainty: "exact",
  },
  rho_f: {
    symbol: "\\rho_f",
    value: 7.0e-7,
    unit: "kg m^-3",
    description: "Background Fluid Density",
    uncertainty: "exact",
  },
  F_swirl_max: {
    symbol: "F_\\text{swirl}^\\text{max}",
    value: 29.053507,
    unit: "N",
    description: "Maximum Swirl Tension",
    uncertainty: "exact",
  },
  F_gr_max: {
    symbol: "F_\\text{gr}^\\text{max}",
    value: 3.02563e43,
    unit: "N",
    description: "Maximum Gravitational Force",
    uncertainty: "exact",
  },

  // --- Standard Physical Constants (CODATA/Canonical) ---
  c: {
    symbol: "c",
    value: 299792458,
    unit: "m s^-1",
    description: "Speed of light in vacuum",
    uncertainty: "exact",
  },
  G: {
    symbol: "G",
    value: 6.67430e-11,
    unit: "m^3 kg^-1 s^-2",
    description: "Newtonian constant of gravitation",
    uncertainty: "2.2e-5",
  },
  h: {
    symbol: "h",
    value: 6.62607015e-34,
    unit: "J Hz^-1",
    description: "Planck constant",
    uncertainty: "exact",
  },
  alpha: {
    symbol: "\\alpha",
    value: 7.2973525643e-3,
    unit: "",
    description: "Fine-structure constant",
    uncertainty: "1.6e-10",
  },
  R_c: {
    symbol: "r_c",
    value: 1.40897017e-15,
    unit: "m",
    description: "Coulomb barrier",
    uncertainty: "exact",
  },
  R_e: {
    symbol: "R_e",
    value: 2.8179403262e-15,
    unit: "m",
    description: "Classical electron radius",
    uncertainty: "1.3e-24",
  },
  alpha_g: {
    symbol: "\\alpha_g",
    value: 1.7518e-45,
    unit: "",
    description: "Gravitational coupling constant",
    uncertainty: "exact",
  },
  mu_0: {
    symbol: "\\mu_0",
    value: 4 * Math.PI * 1e-7,
    unit: "N A^-2",
    description: "Vacuum magnetic permeability",
    uncertainty: "exact",
  },
  varepsilon_0: {
    symbol: "\\varepsilon_0",
    value: 1 / (4 * Math.PI * 1e-7 * (299792458 ** 2)),
    unit: "F m^-1",
    description: "Vacuum electric permittivity",
    uncertainty: "exact",
  },
  Z_0: {
    symbol: "Z_0",
    value: 376.730313412,
    unit: "Ω",
    description: "Characteristic impedance of vacuum",
    uncertainty: "1.6e-10",
  },
  hbar: {
    symbol: "\\hbar",
    value: 1.054571817e-34,
    unit: "J s",
    description: "Reduced Planck constant",
    uncertainty: "exact",
  },
  L_p: {
    symbol: "L_p",
    value: 1.616255e-35,
    unit: "m",
    description: "Planck length",
    uncertainty: "1.1e-5",
  },
  M_p: {
    symbol: "M_p",
    value: 2.176434e-8,
    unit: "kg",
    description: "Planck mass",
    uncertainty: "1.1e-5",
  },
  t_p: {
    symbol: "t_p",
    value: 5.391247e-44,
    unit: "s",
    description: "Planck time",
    uncertainty: "1.1e-5",
  },
  T_p: {
    symbol: "T_p",
    value: 1.416784e32,
    unit: "K",
    description: "Planck temperature",
    uncertainty: "1.1e-5",
  },
  e: {
    symbol: "e",
    value: 1.602176634e-19,
    unit: "C",
    description: "Elementary charge",
    uncertainty: "exact",
  },
  R_: {
    symbol: "R_\\infty",
    value: 10973731.568157,
    unit: "m^-1",
    description: "Rydberg constant",
    uncertainty: "1.1e-12",
  },
  a_0: {
    symbol: "a_0",
    value: 5.29177210903e-11,
    unit: "m",
    description: "Bohr radius",
    uncertainty: "1.6e-10",
  },
  M_e: {
    symbol: "M_e",
    value: 9.1093837015e-31,
    unit: "kg",
    description: "Electron mass",
    uncertainty: "3.1e-10",
  },
  M_pr: {
    symbol: "M_\\text{proton}",
    value: 1.67262192369e-27,
    unit: "kg",
    description: "Proton mass",
    uncertainty: "3.1e-10",
  },
  M_n: {
    symbol: "M_\\text{neutron}",
    value: 1.67492749804e-27,
    unit: "kg",
    description: "Neutron mass",
    uncertainty: "5.1e-10",
  },
  k_B: {
    symbol: "k_B",
    value: 1.380649e-23,
    unit: "J K^-1",
    description: "Boltzmann constant",
    uncertainty: "exact",
  },
  R: {
    symbol: "R",
    value: 8.314462618,
    unit: "J mol^-1 K^-1",
    description: "Gas constant",
    uncertainty: "exact",
  },
  "alpha-1": {
    symbol: "\\frac{1}{\\alpha}",
    value: 137.035999084,
    unit: "",
    description: "Fine structure constant reciprocal",
    uncertainty: "1.6e-10",
  },
  f_c: {
    symbol: "f_c",
    value: 1.235589965e20,
    unit: "m",
    description: "Compton frequency of the electron",
    uncertainty: "1.0e-10",
  },
  omega_c: {
    symbol: "\\Omega_c",
    value: 7.763440711e20,
    unit: "m",
    description: "Compton angular frequency of the electron",
    uncertainty: "1.0e-10",
  },
  lambda_c: {
    symbol: "\\lambda_c",
    value: 2.42631023867e-12,
    unit: "m",
    description: "Compton wavelength of the electron",
    uncertainty: "1.0e-10",
  },
  Phi_0: {
    symbol: "\\Phi_0",
    value: 2.067833848e-15,
    unit: "Wb",
    description: "Magnetic flux quantum",
    uncertainty: "exact",
  },
  varphi: {
    symbol: "\\varphi",
    value: 1.618033988,
    unit: "",
    description: "Golden ratio (Fibonacci constant)",
    uncertainty: "7.3e-22",
  },
  eV: {
    symbol: "eV",
    value: 1.602176634e-19,
    unit: "J",
    description: "Electron volt",
    uncertainty: "exact",
  },
  G_F: {
    symbol: "G_F",
    value: 0.000011663787,
    unit: "GeV^-2",
    description: "Fermi coupling constant",
    uncertainty: "6e-12",
  },
  lambda_p: {
    symbol: "\\lambda_\\text{proton}",
    value: 1.32140985539e-15,
    unit: "m",
    description: "Proton Compton wavelength",
    uncertainty: "4e-25",
  },
  q_p: {
    symbol: "q_p",
    value: 1.87554595641e-18,
    unit: "C",
    description: "Planck charge",
    uncertainty: "exact",
  },
  E_p: {
    symbol: "E_p",
    value: 1.956e9,
    unit: "J",
    description: "Planck energy",
    uncertainty: "exact",
  },
  ER_: {
    symbol: "ER_\\infty",
    value: 2.1798723611035e-18,
    unit: "J",
    description: "Rydberg energy (in joules)",
    uncertainty: "1.1e-12",
  },
  fR_: {
    symbol: "fR_\\infty",
    value: 3.2898419602508e15,
    unit: "Hz",
    description: "Rydberg frequency",
    uncertainty: "1.1e-12",
  },
  sigma: {
    symbol: "\\sigma",
    value: 5.670374419e-8,
    unit: "W m^-2 K^-4",
    description: "Stefan-Boltzmann constant",
    uncertainty: "exact",
  },
  b: {
    symbol: "b",
    value: 2.897771955e-3,
    unit: "m K",
    description: "Wien displacement constant",
    uncertainty: "exact",
  },
  k_e: {
    symbol: "k_e",
    value: 8.9875517862e9,
    unit: "N m^2 C^-2",
    description: "Coulomb constant",
    uncertainty: "exact",
  },
};

// Convenience exports mirroring the Python "unpacking"
export const vSwirl = sstConstants["v_swirl"].value;
export const rC = sstConstants["r_c"].value;
export const rhoCore = sstConstants["rho_core"].value;
export const rhoF = sstConstants["rho_f"].value;
export const FSwirlMax = sstConstants["F_swirl_max"].value;
export const FGrMax = sstConstants["F_gr_max"].value;

export const cConst = sstConstants["c"].value;
export const GConst = sstConstants["G"].value;
export const hConst = sstConstants["h"].value;
export const alphaConst = sstConstants["alpha"].value;
export const ReConst = sstConstants["R_e"].value;

export const alphaG = sstConstants["alpha_g"].value;
export const mu0 = sstConstants["mu_0"].value;
export const epsilon0 = sstConstants["varepsilon_0"].value;
export const Z0 = sstConstants["Z_0"].value;
export const hbarConst = sstConstants["hbar"].value;
export const Lp = sstConstants["L_p"].value;
export const Mp = sstConstants["M_p"].value;
export const tp = sstConstants["t_p"].value;
export const Tp = sstConstants["T_p"].value;
export const eCharge = sstConstants["e"].value;
export const RInf = sstConstants["R_"].value;
export const a0 = sstConstants["a_0"].value;
export const Me = sstConstants["M_e"].value;
export const Mpr = sstConstants["M_pr"].value;
export const Mn = sstConstants["M_n"].value;
export const kB = sstConstants["k_B"].value;
export const RGas = sstConstants["R"].value;
export const alphaInv = sstConstants["alpha-1"].value;
export const Phi0 = sstConstants["Phi_0"].value;
export const varphiConst = sstConstants["varphi"].value;
export const eVConst = sstConstants["eV"].value;
export const GF = sstConstants["G_F"].value;
export const lambdaP = sstConstants["lambda_p"].value;
export const qP = sstConstants["q_p"].value;
export const Ep = sstConstants["E_p"].value;
export const ERInf = sstConstants["ER_"].value;
export const fRInf = sstConstants["fR_"].value;
export const sigmaSB = sstConstants["sigma"].value;
export const bWien = sstConstants["b"].value;
