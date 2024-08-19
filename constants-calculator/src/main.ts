import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LatexDisplayComponent } from './app/latex-display/latex-display.component';

bootstrapApplication(LatexDisplayComponent).catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
