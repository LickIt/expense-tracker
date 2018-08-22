import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { first, flatMap } from 'rxjs/operators';
import { Category } from '../../../models/category.model';

@Component({
    selector: 'app-category-list',
    templateUrl: './category.list.component.html',
    styleUrls: ['./category.list.component.css']
})
export class CategoryListComponent implements OnInit {
    public categories: Category[];
    public error: any;


    constructor(
        private authService: AuthService,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        const userid = this.authService.getLoggedInUserId();
        this.categoryService.getCategories(userid)
            .pipe(first())
            .subscribe(
                categories => this.categories = categories,
                error => this.error = error
            );
    }
}
