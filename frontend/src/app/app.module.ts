import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './common/auth.guard';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './common/jwt.interceptor';
import { ROUTING } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ROUTING
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
