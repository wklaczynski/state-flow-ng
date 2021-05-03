import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../domain/appconfig';

@Injectable()
export class AppConfigService {

    config: AppConfig = {
        theme: 'saga-blue',
        dark: false,
        inputStyle: 'outlined',
        ripple: true
    };

    public configUpdate$;

    private configUpdate = new Subject<AppConfig>();

    constructor() {
        this.configUpdate$ = this.configUpdate.asObservable();
    }

    updateConfig(config: AppConfig) {
        this.config = config;
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}
