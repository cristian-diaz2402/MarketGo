//app.config.ts
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { firebaseProviders } from "./firebase.config";
import { routes } from "./app-routing";
import { provideToastr } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    firebaseProviders,
    provideHttpClient(),
    provideToastr(), // Proveedor de ngx-toastr
    importProvidersFrom(BrowserAnimationsModule), // Animaciones necesarias para toastr
  ],
};
