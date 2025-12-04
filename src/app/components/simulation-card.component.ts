
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationConfig, GlobalSettings } from '../types';
import { CanvasComponent } from './canvas.component';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-simulation-card',
  standalone: true,
  imports: [CommonModule, CanvasComponent, IconComponent],
  template: `
    <div class="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col relative group w-full max-w-xs">
      
      <!-- Header Overlay -->
      <div class="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-10 pointer-events-none">
        <div class="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
             <h3 class="text-cyan-400 font-bold text-xs uppercase tracking-wider">{{ config.name }}</h3>
        </div>
        <button 
            (click)="forceReset()"
            class="bg-black/60 backdrop-blur-sm p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors pointer-events-auto cursor-pointer"
            title="Restart Simulation"
        >
            <app-icon name="refresh-cw" [size]="14"></app-icon>
        </button>
      </div>

      <!-- Canvas Area -->
      <div class="flex-grow relative aspect-square bg-black">
        <app-canvas *ngIf="isAlive" [config]="config" [globalSettings]="globalSettings"></app-canvas>
      </div>

      <!-- Footer Info & Controls -->
      <div class="bg-gray-950 p-3 border-t border-gray-800 space-y-3">
        
        <!-- Description -->
        <div class="flex items-start gap-2 min-h-[2rem]">
            <app-icon name="info" [size]="14" class="text-gray-500 mt-0.5 flex-shrink-0"></app-icon>
            <p class="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {{ config.nuanceDescription }}
            </p>
        </div>

        <!-- Inputs Grid -->
        <div class="grid grid-cols-3 gap-2">
            
            <ng-container *ngFor="let field of getActiveFields()">
                <div class="flex flex-col gap-1 bg-gray-900 rounded border border-gray-800 p-1.5 focus-within:border-cyan-500/50 transition-colors">
                    <label [for]="field.key + '-' + config.id" class="text-[9px] text-gray-500 uppercase font-bold tracking-wider truncate" [title]="field.label">{{field.label}}</label>
                    <input 
                        [id]="field.key + '-' + config.id"
                        type="number" 
                        [step]="field.step"
                        [min]="field.min"
                        [max]="field.max"
                        [value]="getValue(field)" 
                        (input)="updateConfig(field, $event)"
                        class="w-full bg-transparent text-xs text-cyan-400 font-mono outline-none appearance-none p-0 border-none"
                    />
                </div>
            </ng-container>

        </div>
      </div>
    </div>
  `
})
export class SimulationCardComponent {
  @Input({ required: true }) config!: any; 
  @Input({ required: true }) globalSettings!: GlobalSettings;

  isAlive = true;
  private resetTimeout: any;

  // Base fields
  baseFields = [
    { key: 'ballCount', label: 'Balls(Box)', step: 1, min: 1, max: 500, reset: true },
    { key: 'ballSize', label: 'Size', step: 1, min: 1, max: 100, reset: true },
    { key: 'gravity', label: 'Gravity', step: 0.05, min: -2, max: 2, reset: false },
    { key: 'restitution', label: 'Bounce', step: 0.05, min: 0, max: 1.5, reset: false },
    { key: 'friction', label: 'Fric', step: 0.001, min: 0, max: 1, reset: false },
    { key: 'rotationSpeed', label: 'Spin(Box)', step: 0.001, min: -0.5, max: 0.5, reset: false },
  ];

  // Swarm specific fields
  swarmFields = [
    { key: 'swarmParams.innerBallCount', label: 'Balls(r)', step: 1, min: 0, max: 500, reset: true },
    { key: 'swarmParams.innerRadius', label: 'Radius(r)', step: 0.05, min: 0.1, max: 0.9, reset: true },
    { key: 'swarmParams.innerRotationSpeed', label: 'Spin(r)', step: 0.001, min: -0.5, max: 0.5, reset: false },
  ];

  // Fluid Vortex specific fields
  fluidVortexFields = [
    { key: 'fluidVortexParams.innerBallCount', label: 'Balls(r)', step: 1, min: 0, max: 500, reset: true },
    { key: 'fluidVortexParams.vortexRadius', label: 'Radius(r)', step: 0.05, min: 0.1, max: 0.9, reset: false },
    { key: 'fluidVortexParams.vortexStrength', label: 'Speed(r)', step: 0.1, min: -20, max: 20, reset: false },
  ];

  getActiveFields() {
    if (this.config.physicsModel === 'dual-ring-swarm') {
        return [...this.baseFields, ...this.swarmFields];
    }
    if (this.config.physicsModel === 'fluid-vortex') {
        return [...this.baseFields, ...this.fluidVortexFields];
    }
    return this.baseFields;
  }

  getValue(field: any) {
    if (field.key.includes('.')) {
        const [parent, child] = field.key.split('.');
        return this.config[parent][child];
    }
    return this.config[field.key];
  }

  forceReset() {
    this.isAlive = false;
    setTimeout(() => {
        this.isAlive = true;
    }, 0);
  }

  updateConfig(field: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseFloat(input.value);
    
    if (!isNaN(val)) {
        if (field.key.includes('.')) {
             const [parent, child] = field.key.split('.');
             this.config[parent][child] = val;
        } else {
             this.config[field.key] = val;
        }
        
        if (field.reset) {
            if (this.resetTimeout) clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(() => {
                this.forceReset();
            }, 500);
        }
    }
  }
}
