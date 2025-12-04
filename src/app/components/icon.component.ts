
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      [attr.width]="size" 
      [attr.height]="size" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      [class]="class"
    >
      <ng-container [ngSwitch]="name">
        <!-- Activity -->
        <polyline *ngSwitchCase="'activity'" points="22 12 18 12 15 21 9 3 6 12 2 12" />
        
        <!-- Play -->
        <polygon *ngSwitchCase="'play'" points="5 3 19 12 5 21 5 3" />
        
        <!-- Pause -->
        <ng-container *ngSwitchCase="'pause'">
            <line x1="10" y1="4" x2="10" y2="20" />
            <line x1="14" y1="4" x2="14" y2="20" />
        </ng-container>

        <!-- RefreshCw -->
        <ng-container *ngSwitchCase="'refresh-cw'">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
        </ng-container>

        <!-- Info -->
        <ng-container *ngSwitchCase="'info'">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </ng-container>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: number | string = 24;
  @Input() class: string = '';
}
