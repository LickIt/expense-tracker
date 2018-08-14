import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ExpenseAddComponent } from './components/expense/add/expense.add.component';
import { ExpenseListComponent } from './components/expense/list/expense.list.component';
import { CategoryListComponent } from './components/category/list/category.list.component';
import { CategoryEditComponent } from './components/category/edit/category.edit.component';
import { ChartsComponent } from './components/charts/charts.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'expense/add', component: ExpenseAddComponent, canActivate: [AuthGuard] },
    { path: 'expense', component: ExpenseListComponent, canActivate: [AuthGuard] },
    { path: 'category/edit/:id', component: CategoryEditComponent, canActivate: [AuthGuard] },
    { path: 'category/edit', component: CategoryEditComponent, canActivate: [AuthGuard] },
    { path: 'category', component: CategoryListComponent, canActivate: [AuthGuard] },
    { path: 'charts', component: ChartsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const ROUTING = RouterModule.forRoot(appRoutes);
