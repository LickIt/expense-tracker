import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {first} from 'rxjs/operators';
import {Category} from '../../../models/category.model';

@Component({
    selector: 'app-category-list',
    templateUrl: './category.list.component.html',
    styleUrls: ['./category.list.component.css']
})
export class CategoryListComponent implements OnInit {
    public categories: Category[];
    public error: any;


    constructor(private categoryService: CategoryService) {
    }

    ngOnInit() {
        this.categoryService.getCategories()
            .pipe(first())
            .subscribe(
                categories => this.categories = categories,
                error => this.error = (error.error && error.error.message) || error
            );
    }

    onDeleteClick(category: Category): void {
        const confirmation = window.confirm(`Are you sure you want to delete category: ${category.name}?`);
        if (confirmation) {
            this.categoryService.deleteCategory(category.id)
                .pipe(first())
                .subscribe(
                    res => this.categories = this.categories.filter(c => c.id !== category.id),
                    error => this.error = (error.error && error.error.message) || error
                );
        }
    }
}
