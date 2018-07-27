import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { first } from 'rxjs/operators';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .pipe(first())
            .subscribe(users => {
                this.users = users;
            });
    }
}
