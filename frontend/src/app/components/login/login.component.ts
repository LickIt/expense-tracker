import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { Validators, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loading = false;
    returnUrl: string;
    error: string;

    loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder) { }

    ngOnInit() {
        // reset login status
        this.authService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        const username = this.loginForm.controls.username.value;
        const password = this.loginForm.controls.password.value;
        this.loading = true;
        this.authService.login(username, password)
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
