import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private router: Router) { }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (!token) {
            this.router.navigate(['/']);
            return false;
        }
        else {
            return true;
        }

    }

}
