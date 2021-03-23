import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'app-login',
    template: ``
})
export class LoginComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {
    }

    ngOnInit() {
        // reset login status
        this.authService.logout();

        const fragment = this.route.snapshot.fragment;
        if (fragment) {
            const matches = /access_token=([^&]+)/.exec(fragment);
            if (matches && matches[1]) {
                const accessToken = matches[1];
                this.authService.login(accessToken);
                this.router.navigate(["/"]);
            }
        } else {
            this.authService.redirectToLogin()
        }
    }
}
