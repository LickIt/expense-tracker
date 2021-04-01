import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {ROUTING} from './app.routing';
import {AuthGuard} from './common/auth.guard';
import {JwtInterceptor} from './common/jwt.interceptor';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {AuthService} from './services/auth.service';
import {LayoutModule} from '@angular/cdk/layout';
import {
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldControl,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ExpenseAddComponent} from './components/expense/add/expense.add.component';
import {ExpenseService} from './services/expense.service';
import {CategoryService} from './services/category.service';
import {ExpenseListComponent} from './components/expense/list/expense.list.component';
import {DatePipe} from '@angular/common';
import {CategoryListComponent} from './components/category/list/category.list.component';
import {CategoryEditComponent} from './components/category/edit/category.edit.component';
import {CategoryColorInputComponent} from './components/category/color/category-color.input.component';
import {ChartsComponent} from './components/charts/charts.component';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ROUTING,
        // material components
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatGridListModule,
        MatExpansionModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        UserInfoComponent,
        ToolbarComponent,
        ExpenseAddComponent,
        ExpenseListComponent,
        CategoryListComponent,
        CategoryEditComponent,
        CategoryColorInputComponent,
        ChartsComponent
    ],
    providers: [
        AuthGuard,
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        ExpenseService,
        CategoryService,
        DatePipe,
        {
            provide: MatFormFieldControl,
            useExisting: CategoryColorInputComponent
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
