// sst-physics.service.ts

import { Injectable } from "@angular/core";
import {
  sstConstants,
  vSwirl,
  rC,
  rhoCore,
  rhoF,
  FSwirlMax,
  FGrMax,
  cConst,
  GConst,
  hConst,
  alphaConst,
  ReConst,
  alphaG,
  mu0,
  epsilon0,
  Z0,
  hbarConst,
  Lp,
  Mp,
  tp,
  Tp,
  eCharge,
  RInf,
  a0,
  Me,
  Mpr,
  Mn,
  kB,
  RGas,
  alphaInv,
  Phi0,
  varphiConst,
  eVConst,
  GF,
  lambdaP,
  qP,
  Ep,
  ERInf,
  fRInf,
  sigmaSB,
  bWien,
} from "./sst-constants";

export interface TableRow {
  latex: string;
  value: number | string;
}

export interface MassRow {
  particle: string;
  topology: string;
  hyperbolicVolume: number | string;
  sstMassKg: number;
  codataMassKg: number;
  errorPercent: number;
}

@Injectable({
  providedIn: "root",
})
export class SstPhysicsService {
  readonly pi = Math.PI;

  // Canonical constants (short aliases)
  readonly vSwirl = vSwirl;
  readonly rC = rC;
  readonly rhoCore = rhoCore;
  readonly rhoF = rhoF;
  readonly FSwirlMax = FSwirlMax;
  readonly FGrMax = FGrMax;

  readonly c = cConst;
  readonly G = GConst;
  readonly h = hConst;
  readonly alpha = alphaConst;
  readonly Re = ReConst;

  readonly alphaG = alphaG;
  readonly mu0 = mu0;
  readonly epsilon0 = epsilon0;
  readonly Z0 = Z0;
  readonly hbar = hbarConst;
  readonly Lp = Lp;
  readonly Mp = Mp;
  readonly tp = tp;
  readonly Tp = Tp;
  readonly e = eCharge;
  readonly RInf = RInf;
  readonly a0 = a0;
  readonly Me = Me;
  readonly Mpr = Mpr;
  readonly Mn = Mn;
  readonly kB = kB;
  readonly RGas = RGas;
  readonly alphaInv = alphaInv;
  readonly Phi0 = Phi0;
  readonly varphi = varphiConst;
  readonly eV = eVConst;
  readonly GF = GF;
  readonly lambdaP = lambdaP;
  readonly qP = qP;
  readonly Ep = Ep;
  readonly ERInf = ERInf;
  readonly fRInf = fRInf;
  readonly sigmaSB = sigmaSB;
  readonly bWien = bWien;

  // f_c, omega_c, lambda_c are recomputed as in the Python script override
  readonly lambdaC: number;
  readonly fC: number;
  readonly omegaC: number;

  constructor() {
    this.lambdaC = this.h / (this.Me * this.c);
    this.fC = this.c / this.lambdaC;
    this.omegaC = (this.Me * this.c ** 2) / this.hbar;
  }

  // ==========================================
  // 1. Vortex thermodynamics (SST protocol)
  // ==========================================

  vortexEnergyDensity(r: number, omega: number, T: number): number {
    if (r === 0) {
      return Number.POSITIVE_INFINITY;
    }
    const exponent = (this.h * omega) / (this.kB * T);
    const denom = Math.exp(exponent) - 1;
    if (!isFinite(denom) || denom === 0) {
      return 0;
    }
    return (this.FSwirlMax * omega ** 3) / (this.vSwirl * r ** 2 * denom);
  }

  vortexEntropyDensity(r: number, T: number): number {
    if (r === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return (
      (4 *
        this.pi ** 4 *
        this.FSwirlMax *
        this.kB ** 4 *
        T ** 3) /
      (45 * this.vSwirl * r ** 2 * this.h ** 4)
    );
  }

  vortexFluxDensity(r: number, T: number): number {
    if (r === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return (
      (this.pi ** 4 * this.FSwirlMax * this.kB ** 4 * T ** 4) /
      (15 * this.h ** 4 * r)
    );
  }

  totalEnergy(T: number, r: number): number {
    if (r === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return (this.FSwirlMax * T ** 4) / (this.vSwirl * r ** 2);
  }

  totalEntropy(T: number, r: number): number {
    if (r === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return (this.FSwirlMax * T ** 3) / (this.vSwirl * r ** 2);
  }

  // ==========================================
  // 2. Field equations (scalar stand-ins)
  // ==========================================

  einsteinFieldEquations(
    R_mu_nu: number,
    R: number,
    g_mu_nu: number,
    T_mu_nu: number
  ): number {
    return (
      R_mu_nu -
      0.5 * R * g_mu_nu -
      ((8 * this.pi * this.G) / this.c ** 4) * T_mu_nu
    );
  }

  vortexTensor(
    nabla_mu_omega_nu: number,
    g_mu_nu: number,
    nabla_alpha_omega_alpha: number
  ): number {
    return nabla_mu_omega_nu - 0.5 * g_mu_nu * nabla_alpha_omega_alpha;
  }

  // ==========================================
  // 3. Adjusted time (SST metric)
  // ==========================================

  adjustedTime(
    deltaT: number,
    M: number,
    r: number,
    J?: number
  ): number {
    if (J === undefined || J === null) {
      const term = 1 - (2 * this.G * M) / (r * this.c ** 2);
      return deltaT * Math.sqrt(Math.max(term, 0));
    } else {
      const term =
        1 -
        (2 * this.G * M) / (r * this.c ** 2) -
        (J ** 2) / (r ** 3 * this.c ** 2);
      return deltaT * Math.sqrt(Math.max(term, 0));
    }
  }

  angularMomentum(M: number, a: number): number {
    return M * a;
  }

  vortexEnergy(rho: number, omega: number): number {
    return 0.5 * rho * omega ** 2;
  }

  gravitationalPotential(M: number, r: number): number {
    return -this.G * M / r;
  }

  swirlPotential(r: number): number {
    // -v_swirl^2 / (2 r)
    return -this.vSwirl ** 2 / (2 * r);
  }

  lenseThirringPrecession(J: number, r: number): number {
    return (this.G * J) / (this.c ** 2 * r ** 3);
  }

  swirlAngularVelocity(r: number): number {
    return (this.vSwirl / this.rC) * Math.exp(-r / this.rC);
  }

  circulation(v: number[], dl: number[]): number {
    if (v.length !== dl.length) {
      throw new Error("v and dl must have same length");
    }
    let sum = 0;
    for (let i = 0; i < v.length; i++) {
      sum += v[i] * dl[i];
    }
    return sum;
  }

  vortexDensity(r: number): number {
    return this.rhoCore * Math.exp(-r / this.rC);
  }

  // ==========================================
  // 4. Effective mass integrals
  // ==========================================

  // Simple numeric integration (trapezoidal rule) for 0..rVal
  private integrateVortexDensity(
    rVal: number,
    steps: number = 2000
  ): number {
    const a = 0;
    const b = rVal;
    const h = (b - a) / steps;
    let sum = 0;

    for (let i = 0; i <= steps; i++) {
      const rPrime = a + i * h;
      const weight = i === 0 || i === steps ? 0.5 : 1;
      const integrand =
        4 * this.pi * rPrime ** 2 * this.vortexDensity(rPrime);
      sum += weight * integrand;
    }
    return sum * h;
  }

  mEffectiveNumeric(rVal: number, steps: number = 2000): number {
    return this.integrateVortexDensity(rVal, steps);
  }

  mEffectiveAnalytic(rVal: number): number {
    // 4 * pi * rho_core * r_c^3 * (2 - (2 + r/r_c) * e^{-r/r_c})
    const x = rVal / this.rC;
    return (
      4 *
      this.pi *
      this.rhoCore *
      this.rC ** 3 *
      (2 - (2 + x) * Math.exp(-x))
    );
  }

  // ==========================================
  // 5. Topological mass derivation (proton, neutron, electron)
  // ==========================================

  private readonly phi = (1 + Math.sqrt(5)) / 2;

  private readonly Vol_5_2 = 2.82812;
  private readonly Vol_6_1 = 3.16396;

  private get VolProtonSum(): number {
    return 2 * this.Vol_5_2 + this.Vol_6_1;
  }

  private get VolNeutronSum(): number {
    return this.Vol_5_2 + 2 * this.Vol_6_1;
  }

  private get torusScale(): number {
    return 4 * this.pi ** 2 * this.rC ** 3;
  }

  private get layerFactor(): number {
    // phi^{-16}
    return this.phi ** -16;
  }

  getTopologicalMasses(): MassRow[] {
    const MProtonSST =
      this.rhoCore *
      this.VolProtonSum *
      this.torusScale *
      this.layerFactor;
    const MNeutronSST =
      this.rhoCore *
      this.VolNeutronSum *
      this.torusScale *
      this.layerFactor;
    const MeDerived = (2 * this.FSwirlMax * this.rC) / this.c ** 2;

    const protonError =
      (Math.abs(MProtonSST - this.Mpr) / this.Mpr) * 100;
    const neutronError =
      (Math.abs(MNeutronSST - this.Mn) / this.Mn) * 100;
    const electronError =
      (Math.abs(MeDerived - this.Me) / this.Me) * 100;

    return [
      {
        particle: "Proton (uud)",
        topology: "2x(5_2) + 1x(6_1)",
        hyperbolicVolume: this.VolProtonSum,
        sstMassKg: MProtonSST,
        codataMassKg: this.Mpr,
        errorPercent: protonError,
      },
      {
        particle: "Neutron (udd)",
        topology: "1x(5_2) + 2x(6_1)",
        hyperbolicVolume: this.VolNeutronSum,
        sstMassKg: MNeutronSST,
        codataMassKg: this.Mn,
        errorPercent: neutronError,
      },
      {
        particle: "Electron (3_1)",
        topology: "Torus 3_1",
        hyperbolicVolume: "N/A",
        sstMassKg: MeDerived,
        codataMassKg: this.Me,
        errorPercent: electronError,
      },
    ];
  }

  // ==========================================
  // 6. Time dilation with swirl corrections
  // ==========================================

  getAdjustedTimeAt(
    r: number,
    deltaT: number = 1.0
  ): { numeric: number; analytic: number } {
    const omegaMagnitude = this.vSwirl / this.rC;

    const termSwirlV =
      (this.vSwirl ** 2 / this.c ** 2) * Math.exp(-r / this.rC);
    const termSwirlRot =
      ((omegaMagnitude * this.rC) ** 2 / this.c ** 2) *
      Math.exp(-r / this.rC);

    const mEffNumeric = this.mEffectiveNumeric(r);
    const mEffAnalytic = this.mEffectiveAnalytic(r);

    const termNumeric =
      1 -
      (2 * this.G * mEffNumeric) / (r * this.c ** 2) -
      termSwirlV -
      termSwirlRot;
    const termAnalytic =
      1 -
      (2 * this.G * mEffAnalytic) / (r * this.c ** 2) -
      termSwirlV -
      termSwirlRot;

    const tAdjusted = deltaT * Math.sqrt(Math.max(termNumeric, 0));
    const tAdjusted2 = deltaT * Math.sqrt(Math.max(termAnalytic, 0));

    return { numeric: tAdjusted, analytic: tAdjusted2 };
  }

  // ==========================================
  // 7. Quantum limits (lambda_c, f_e, omega_c)
  // ==========================================

  getQuantumLimits(): { lambdaC: number; f_e: number; omega_c: number } {
    const lambdaC = this.lambdaC;
    const f_e = (this.Me * this.c ** 2) / this.h;
    const omega_c = (this.Me * this.c ** 2) / this.hbar;
    return { lambdaC, f_e, omega_c };
  }

  // ==========================================
  // 8. Table groups (Lambda, a0, r_e, e, alpha_g, G, etc.)
  // ==========================================

  getLambdaRows(): TableRow[] {
    const LambdaSwirl =
      4 * this.pi * this.rhoCore * this.vSwirl * this.rC ** 3;
    const LambdaEM =
      (this.e ** 2) / (4 * this.pi * this.epsilon0);
    return [
      {
        latex:
          "\\Lambda_{SST} = 4 \\pi \\rho_{core} v_{\\circlearrowleft} r_c^3",
        value: LambdaSwirl,
      },
      {
        latex: "\\Lambda_{EM} = e^2 / (4 \\pi \\varepsilon_0)",
        value: LambdaEM,
      },
      {
        latex: "Ratio \\\\Lambda_{SST} / \\\\Lambda_{EM}",
        value: LambdaSwirl / LambdaEM,
      },
    ];
  }

  getBohrRadiusRows(): TableRow[] {
    return [
      { latex: "a_0", value: this.a0 },
      {
        latex: "(c^2 r_c) / (2 v_{\\circlearrowleft}^2)",
        value: (this.c ** 2 * this.rC) / (2 * this.vSwirl ** 2),
      },
      {
        latex:
          "(F_{swirl}^{max} r_c^2) / (M_e v_{\\circlearrowleft}^2)",
        value:
          (this.FSwirlMax * this.rC ** 2) /
          (this.Me * this.vSwirl ** 2),
      },
      {
        latex:
          "(4 \\pi \\varepsilon_0 \\hbar^2) / (M_e e^2)",
        value:
          (4 * this.pi * this.epsilon0 * this.hbar ** 2) /
          (this.Me * this.e ** 2),
      },
      {
        latex: "h / (4 \\pi M_e v_{\\circlearrowleft})",
        value:
          this.h / (4 * this.pi * this.Me * this.vSwirl),
      },
    ];
  }

  getBohrRadiusSquaredRows(): TableRow[] {
    return [
      { latex: "a_0^2", value: this.a0 ** 2 },
      {
        latex: "h / (4 \\pi^2 f_c M_e \\alpha^2)",
        value:
          this.h /
          (4 *
            this.pi ** 2 *
            this.fC *
            this.Me *
            this.alpha ** 2),
      },
      {
        latex:
          "(c^2 r_c) / (2 \\pi f_c v_{\\circlearrowleft} \\alpha^2)",
        value:
          (this.c ** 2 * this.rC) /
          (2 * this.pi * this.fC * this.vSwirl * this.alpha ** 2),
      },
      {
        latex: "Combination Term",
        value:
          ((4 * this.pi * this.FSwirlMax * this.rC ** 2) /
            this.vSwirl) *
          (1 /
            (4 *
              this.pi ** 2 *
              this.Me *
              this.fC *
              this.alpha ** 2)),
      },
    ];
  }

  getClassicalElectronRadiusRows(): TableRow[] {
    return [
      { latex: "r_e", value: this.Re },
      {
        latex: "e^2 / (4 \\pi \\varepsilon_0 M_e c^2)",
        value:
          this.e ** 2 /
          (4 * this.pi * this.epsilon0 * this.Me * this.c ** 2),
      },
      { latex: "2 r_c", value: 2 * this.rC },
      { latex: "\\alpha^2 a_0", value: this.alpha ** 2 * this.a0 },
      {
        latex:
          "e^2 / (8 \\pi \\varepsilon_0 F_{swirl}^{max} r_c)",
        value:
          this.e ** 2 /
          (8 *
            this.pi *
            this.epsilon0 *
            this.FSwirlMax *
            this.rC),
      },
    ];
  }

  getElementaryChargeRows(): TableRow[] {
    return [
      { latex: "e", value: this.e },
      {
        latex:
          "\\sqrt{16 \\pi F_{swirl}^{max} r_c^2 \\varepsilon_0}",
        value: Math.sqrt(
          16 *
            this.pi *
            this.FSwirlMax *
            this.rC ** 2 *
            this.epsilon0
        ),
      },
      {
        latex: "\\sqrt{2 \\alpha h \\varepsilon_0 c}",
        value: Math.sqrt(
          2 * this.alpha * this.h * this.epsilon0 * this.c
        ),
      },
      {
        latex: "\\sqrt{4 v_{\\circlearrowleft} h \\varepsilon_0}",
        value: Math.sqrt(
          4 * this.vSwirl * this.h * this.epsilon0
        ),
      },
    ];
  }

  getGravitationalCouplingRows(): TableRow[] {
    const swirlPot = (2 * this.FSwirlMax * this.rC ** 2) / this.vSwirl;
    return [
      { latex: "\\alpha_g", value: this.alphaG },
      {
        latex:
          "(2 F_{swirl}^{max} v_{\\circlearrowleft} t_p^2) / (Swirl Pot.)",
        value:
          (2 *
            this.FSwirlMax *
            this.vSwirl *
            this.tp ** 2) /
          swirlPot,
      },
      {
        latex: "(v_{\\circlearrowleft}^2 t_p^2) / r_c^2",
        value:
          (this.vSwirl ** 2 * this.tp ** 2) /
          this.rC ** 2,
      },
      {
        latex:
          "(v_{\\circlearrowleft}^2 L_p^2) / (r_c^2 c^2)",
        value:
          (this.vSwirl ** 2 * this.Lp ** 2) /
          (this.rC ** 2 * this.c ** 2),
      },
      {
        latex: "(F_{swirl}^{max} t_p^2) / (a_0 M_e)",
        value:
          (this.FSwirlMax * this.tp ** 2) /
          (this.a0 * this.Me),
      },
    ];
  }

  getGravitationalConstantRows(): TableRow[] {
    return [
      { latex: "G", value: this.G },
      {
        latex:
          "(v_{\\circlearrowleft} c^3 L_p^2) / (2 F_{swirl}^{max} r_c^2)",
        value:
          (this.vSwirl *
            this.c ** 3 *
            this.Lp ** 2) /
          (2 * this.FSwirlMax * this.rC ** 2),
      },
      {
        latex:
          "(v_{\\circlearrowleft} c^3 t_p^2) / (r_c M_e)",
        value:
          (this.vSwirl *
            this.c ** 3 *
            this.tp ** 2) /
          (this.rC * this.Me),
      },
      {
        latex:
          "(F_{swirl}^{max} \\alpha (c t_p)^2) / M_e^2",
        value:
          (this.FSwirlMax *
            this.alpha *
            (this.c * this.tp) ** 2) /
          this.Me ** 2,
      },
      {
        latex: "(v_{\\circlearrowleft} c L_p^2) / (r_c M_e)",
        value:
          (this.vSwirl * this.c * this.Lp ** 2) /
          (this.rC * this.Me),
      },
      {
        latex:
          "(\\alpha_g c^3 r_c) / (v_{\\circlearrowleft} M_e)",
        value:
          (this.alphaG * this.c ** 3 * this.rC) /
          (this.vSwirl * this.Me),
      },
      {
        latex:
          "(v_{\\circlearrowleft} c^5 t_p^2) / (2 F_{swirl}^{max} r_c^2)",
        value:
          (this.vSwirl *
            this.c ** 5 *
            this.tp ** 2) /
          (2 * this.FSwirlMax * this.rC ** 2),
      },
      {
        latex: "c^4 / (4 F_{gr}^{max})",
        value: this.c ** 4 / (4 * this.FGrMax),
      },
    ];
  }

  getFineStructureRows(): TableRow[] {
    return [
      { latex: "\\alpha", value: this.alpha },
      {
        latex:
          "(v_{\\circlearrowleft} e^2) / (8 \\pi \\varepsilon_0 r_c^2 c F_{swirl}^{max})",
        value:
          (this.vSwirl * this.e ** 2) /
          (8 *
            this.pi *
            this.epsilon0 *
            this.rC ** 2 *
            this.c *
            this.FSwirlMax),
      },
    ];
  }

  getComptonWavelengthRows(): TableRow[] {
    return [
      { latex: "\\lambda_c", value: this.lambdaC },
      {
        latex:
          "(2 \\pi c r_c) / v_{\\circlearrowleft}",
        value:
          (2 * this.pi * this.c * this.rC) /
          this.vSwirl,
      },
      {
        latex:
          "(4 \\pi F_{swirl}^{max} r_c^2) / (v_{\\circlearrowleft} M_e c)",
        value:
          (4 *
            this.pi *
            this.FSwirlMax *
            this.rC ** 2) /
          (this.vSwirl * this.Me * this.c),
      },
    ];
  }

  getSwirlVelocityRows(): TableRow[] {
    return [
      { latex: "v_{\\circlearrowleft}", value: this.vSwirl },
      { latex: "c (\\alpha / 2)", value: this.c * (this.alpha / 2) },
    ];
  }

  getDensityCheckRows(): TableRow[] {
    const rhoCalc =
      (4 * this.FSwirlMax) /
      (this.pi * this.alpha ** 2 * this.c ** 2 * this.rC ** 2);
    return [
      {
        latex: "\\rho_{calc} (Force derived)",
        value: rhoCalc,
      },
      {
        latex: "\\rho_{core} (Canonical)",
        value: this.rhoCore,
      },
      { latex: "\\rho_f (Fluid)", value: this.rhoF },
    ];
  }

  getMaxSwirlForceRows(): TableRow[] {
    const rhoCalc =
      (4 * this.FSwirlMax) /
      (this.pi * this.alpha ** 2 * this.c ** 2 * this.rC ** 2);
    return [
      { latex: "F_{swirl}^{max}", value: this.FSwirlMax },
      {
        latex:
          "(c^4 / 4G) \\alpha (r_c / L_p)^{-2}",
        value:
          (this.c ** 4 / (4 * this.G)) *
          this.alpha *
          (this.rC / this.Lp) ** -2,
      },
      {
        latex:
          "(v_{\\circlearrowleft} \\hbar) / (2 r_c^2)",
        value:
          (this.vSwirl * this.hbar) /
          (2 * this.rC ** 2),
      },
      {
        latex:
          "(h \\alpha c) / (8 \\pi r_c^2)",
        value:
          (this.h * this.alpha * this.c) /
          (8 * this.pi * this.rC ** 2),
      },
      {
        latex:
          "e^2 / (16 \\pi \\varepsilon_0 r_c^2)",
        value:
          this.e ** 2 /
          (16 * this.pi * this.epsilon0 * this.rC ** 2),
      },
      {
        latex:
          "\\pi r_c^2 (\\rho_{calc} v_{\\circlearrowleft}^2)",
        value:
          this.pi *
          this.rC ** 2 *
          (rhoCalc * this.vSwirl ** 2),
      },
    ];
  }

  getPlanckConstantRows(): TableRow[] {
    return [
      { latex: "h", value: this.h },
      {
        latex: "4 \\pi M_e v_{\\circlearrowleft} a_0",
        value:
          4 * this.pi * this.Me * this.vSwirl * this.a0,
      },
      {
        latex:
          "(\\pi F_{swirl}^{max} r_e^2) / v_{\\circlearrowleft}",
        value:
          (this.pi * this.FSwirlMax * this.Re ** 2) /
          this.vSwirl,
      },
      {
        latex:
          "(96 \\pi (F_{swirl}^{max})^2 r_c^3 a_0) / (h c^2)",
        value:
          (96 *
            this.pi *
            this.FSwirlMax ** 2 *
            this.rC ** 3 *
            this.a0) /
          (this.h * this.c ** 2),
      },
    ];
  }

  getRydbergRows(): TableRow[] {
    return [
      { latex: "R_\\infty (energy)", value: this.ERInf },
      {
        latex: "v_{\\circlearrowleft}^3 / (\\pi r_c c^3)",
        value:
          this.vSwirl ** 3 / (this.pi * this.rC * this.c ** 3),
      },
    ];
  }

  // ==========================================
  // 9. Circulation & effective vortex mass
  // ==========================================

  getVortexCirculationDiagnostics(): {
    Gamma: number;
    vortexEnergy: number;
    effectiveMass: number;
    electronMass: number;
    protonMassScaled: number;
  } {
    const Gamma = this.vSwirl * this.lambdaP;
    const rhoCheck =
      (4 * this.FSwirlMax) /
      (this.pi * this.alpha ** 2 * this.c ** 2 * this.rC ** 2);
    const rhoCheck2 =
      this.FSwirlMax /
      (this.pi * this.vSwirl ** 2 * this.rC ** 2);
    const E_vortex = 0.5 * rhoCheck * Gamma ** 2 * this.rC;
    const gammaCirc = this.vSwirl * 2 * this.pi * this.rC;
    const mEffVortex =
      (rhoCheck2 * gammaCirc ** 2) /
      (3 * this.pi * this.rC * this.c ** 2);
    const protonMassScaled =
      ((8 * this.pi * rhoCheck2 * this.rC ** 3 * this.vSwirl) /
        this.c) *
      1.6180339887;

    return {
      Gamma,
      vortexEnergy: E_vortex,
      effectiveMass: mEffVortex,
      electronMass: this.Me,
      protonMassScaled,
    };
  }

  // ==========================================
  // 10. Schrödinger–swirl bridge
  // ==========================================

  getQuantumBridgeRows(): TableRow[] {
    const hbarSwirl = Math.sqrt(
      (2 * this.Me * this.FSwirlMax * this.rC ** 3) /
        (5 * this.lambdaC * this.vSwirl)
    );
    const lhs =
      (this.FSwirlMax * this.rC ** 2) /
      (5 * this.lambdaC * this.vSwirl);
    const rhs = this.hbar ** 2 / (2 * this.Me);

    return [
      {
        latex: "\\hbar (Swirl Derived)",
        value: hbarSwirl,
      },
      {
        latex: "\\hbar (Canonical)",
        value: this.hbar,
      },
      {
        latex:
          "LHS: (F_{max} r_c^3) / (5 \\lambda_c v_{\\circlearrowleft})",
        value: lhs,
      },
      {
        latex: "RHS: \\hbar^2 / (2 M_e)",
        value: rhs,
      },
    ];
  }

  getBackgroundFluidDensityCalc(): number {
    const omega_e = this.Me * this.c ** 2 / this.hbar;
    const numerator = 2 * this.Me * this.c ** 2;
    const denom =
      (this.alpha * omega_e) ** 2 *
      (this.Re ** 3 / 3);
    return numerator / denom;
  }

  // ==========================================
  // 11. Example “showcase” evaluation (no console)
  // ==========================================

  getVortexThermodynamicsShowcase(
    T: number = 2.7
  ): {
    r: number;
    fluxDensity: number;
    energyDensity: number;
    entropyDensity: number;
    totalEnergyShell: number;
  } {
    const r = this.rC;
    const omega = this.vSwirl / r;
    const fluxDensity = this.vortexFluxDensity(r, T);
    const energyDensity = this.vortexEnergyDensity(
      r,
      omega,
      T
    );
    const entropyDensity = this.vortexEntropyDensity(r, T);
    const totalEnergyShell = this.totalEnergy(T, r);

    return {
      r,
      fluxDensity,
      energyDensity,
      entropyDensity,
      totalEnergyShell,
    };
  }

  getFieldEquationMockup(): number {
    const R_scalar = 1e-10;
    const g_00 = 1;
    const T_00 = this.rhoCore * this.c ** 2;
    return this.einsteinFieldEquations(
      R_scalar,
      R_scalar,
      g_00,
      T_00
    );
  }

  getPotentialsAtCore(): {
    gravitational: number;
    swirl: number;
    lenseThirring: number;
  } {
    const r = this.rC;
    return {
      gravitational: this.gravitationalPotential(
        this.Me,
        r
      ),
      swirl: this.swirlPotential(r),
      lenseThirring: this.lenseThirringPrecession(
        this.hbar,
        r
      ),
    };
  }
}
