import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './users/user.model';
import { UsersApiService } from './users/users-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  userList: User[];
  userListSubscription: Subscription;

  constructor(private usersApi: UsersApiService) {

  }

  ngOnInit() {
    this.userListSubscription = this.usersApi
      .getUsers()
      .subscribe(res => {
        this.userList = res;
      }, console.error);
  }

  ngOnDestroy() {
    this.userListSubscription.unsubscribe();
  }
}
