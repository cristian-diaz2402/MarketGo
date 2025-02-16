//firebase.config.ts
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { enviroment } from "../enviroments/enviroment";

const firebaseProviders: EnvironmentProviders = makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideAuth(() => getAuth())
]);

export { firebaseProviders};