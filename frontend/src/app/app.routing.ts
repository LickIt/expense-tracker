import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ExpenseAddComponent } from './components/expense/add/expense.add.component';
import { ExpenseListComponent } from './components/expense/list/expense.list.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'expense/add', component: ExpenseAddComponent, canActivate: [AuthGuard] },
    { path: 'expense', component: ExpenseListComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const ROUTING = RouterModule.forRoot(appRoutes);
