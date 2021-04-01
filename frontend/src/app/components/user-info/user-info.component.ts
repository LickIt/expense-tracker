import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
    public user?: User;

    constructor(private authService: AuthService) {
    }

    public ngOnInit() {
        if (this.authService.getToken()) {
            this.getLoggedInUser();
        }

        // update user on login / logout
        this.authService.loginEvent.subscribe(() => this.getLoggedInUser());
        this.authService.logoutEvent.subscribe(() => this.user = null);
    }

    public logout() {
        this.authService.logout(true);
    }

    private getLoggedInUser(): void {
        this.user = this.authService.getLoggedInUser();
    }
}
