import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VersionService {

    constructor(private http: HttpClient) { }

    getVersions() {
        return '';
    }
}