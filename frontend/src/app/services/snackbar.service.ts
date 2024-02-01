import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root',
})

export class SnackbarService {
    url = environment.apiUrl;

    constructor(private snackbar: MatSnackBar) { }

    openSnackbar(message: string, action: string) {
        if (action == 'error') {
            this.snackbar.open(message, '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2000,
                panelClass: ['black-snackbar']
            });
        }
        else {
            this.snackbar.open(message, '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2000,
                panelClass: ['green-snackbar']
            });
        }
    }
}