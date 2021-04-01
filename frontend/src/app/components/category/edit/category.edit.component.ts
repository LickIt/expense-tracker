import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoryService} from '../../../services/category.service';
import {colorPalette} from '../../../common/color.palette';
import {Category} from '../../../models/category.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category.edit.component.html',
    styleUrls: ['./category.edit.component.css']
})
export class CategoryEditComponent implements OnInit {
    private id: number;
    public isNew = true;
    public saving = false;
    public error: any;
    public colors = Array.from(colorPalette.entries());
    public form = this.fb.group({
        name: ['', Validators.required],
        color: [null, Validators.required]
    });
    public selectedColor: string;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private categoryService: CategoryService,
    ) {
    }

    ngOnInit() {
        this.route.params.pipe(first()).subscribe(params => {
            if (params.id) {
                this.id = parseInt(params.id, 10);
                this.isNew = false;
                this.load();
            }
        });
    }

    load() {
        this.categoryService.getCategory(this.id)
            .pipe(first())
            .subscribe(
                category => this.form.patchValue(category),
                error => this.error = (error.error && error.error.message) || error
            );
    }

    onSubmit() {
        this.saving = true;
        const data = this.form.value;
        if (this.id) {
            data.id = this.id;
        }

        let save: Observable<Category>;
        if (this.isNew) {
            save = this.categoryService.createCategory(data);
        } else {
            save = this.categoryService.updateCategory(data);
        }

        save.pipe(first())
            .subscribe(
                category => this.router.navigate(['/category']),
                error => {
                    this.error = (error.error && error.error.message) || error;
                    this.saving = false;
                }
            );
    }
}
