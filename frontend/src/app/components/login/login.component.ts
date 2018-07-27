import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) { }

    ngOnInit() {
        // reset login status
        this.authService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authService.login(this.model.username, this.model.password)
            .pipe(first())
            .subscribe(
                _data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error.error && error.error.message;
                    this.loading = false;
                });
    }
}
