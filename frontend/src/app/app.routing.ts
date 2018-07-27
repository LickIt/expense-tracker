import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const ROUTING = RouterModule.forRoot(appRoutes);
