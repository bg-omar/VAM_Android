// sst-diagnostics.component.ts

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SstPhysicsService, MassRow, TableRow } from "./sst-physics.service";

@Component({
  standalone: true,
  selector: "app-sst-diagnostics",
  imports: [CommonModule],
  templateUrl: "./sst-diagnostics.component.html",
  styleUrls: ["./sst-diagnostics.component.css"],
})
export class SstDiagnosticsComponent implements OnInit {
  massRows: MassRow[] = [];
  lambdaRows: TableRow[] = [];
  bohrRadiusRows: TableRow[] = [];
  densityRows: TableRow[] = [];

  constructor(private sst: SstPhysicsService) {}

  ngOnInit(): void {
    this.massRows = this.sst.getTopologicalMasses();
    this.lambdaRows = this.sst.getLambdaRows();
    this.bohrRadiusRows = this.sst.getBohrRadiusRows();
    this.densityRows = this.sst.getDensityCheckRows();
  }
}
