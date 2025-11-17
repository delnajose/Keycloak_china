import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideKeycloak } from 'keycloak-angular';

bootstrapApplication(App, {
  providers: [
    provideKeycloak({
  config: {
    url: 'http://localhost:8080', // Keycloak base URL
    realm: 'myrealm',             // Make sure this matches your realm
    clientId: 'siemens-portal'
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false
  }
}),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));


