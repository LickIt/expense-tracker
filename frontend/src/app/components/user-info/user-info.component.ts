import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
    public user?: User;

    constructor(private authService: AuthService) { }

    public ngOnInit() {
        if (this.authService.getToken()) {
            this.getLoggedInUser();
        }

        // update user on login / logout
        this.authService.loginEvent.subscribe(_token => {
            this.getLoggedInUser();
        });

        this.authService.logoutEvent.subscribe(_ => this.user = null);
    }

    public logout() {
        this.authService.logout(true);
    }

    private getLoggedInUser() {
        this.authService.getLoggedInUser()
            .pipe(first())
            .subscribe(user => this.user = user);
    }
}
