import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { PrimeComponent } from './app/prime.component';

bootstrapApplication(PrimeComponent, appConfig)
  .catch((err) => console.error(err));
