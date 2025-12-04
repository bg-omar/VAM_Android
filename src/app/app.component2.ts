
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Although we use simple event bindings, good to have
import { presets } from './utils/presets';
import { GlobalSettings } from './types';
import { SimulationCardComponent } from './components/simulation-card.component';
import { IconComponent } from './components/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SimulationCardComponent, IconComponent],
  template: `

  `
})
export class AppComponent {
  presets = presets;

  globalSettings: GlobalSettings = {
    timeScale: 1.0,
    gravityMultiplier: 1.0,
    rotationMultiplier: 1.0,
    bouncinessMultiplier: 1.0,
  };

  isPlaying = true;

  togglePlay() {
    if (this.isPlaying) {
      this.globalSettings = { ...this.globalSettings, timeScale: 0 };
    } else {
      this.globalSettings = { ...this.globalSettings, timeScale: 1 };
    }
    this.isPlaying = !this.isPlaying;
  }

  onTimeScaleChange(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!this.isPlaying) this.togglePlay();
    this.globalSettings = { ...this.globalSettings, timeScale: value };
  }

  updateSetting(key: keyof GlobalSettings, event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.globalSettings = { ...this.globalSettings, [key]: value };
  }
}
