import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, flatMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { colorPalette } from '../../../common/color.palette';

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
        private authService: AuthService,
        private categoryService: CategoryService,
    ) { }

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
        this.authService.getLoggedInUser()
            .pipe(
                first(),
                flatMap(user => this.categoryService.getCategory(user.id, this.id)),
                first()
            )
            .subscribe(
                category => this.form.patchValue(category),
                error => this.error = error
            );
    }

    onSubmit() {
        this.saving = true;
        const data = this.form.value;
        if (this.id) {
            data.id = this.id;
        }

        this.authService.getLoggedInUser()
            .pipe(
                first(),
                flatMap(user => {
                    if (this.isNew) {
                        return this.categoryService.createCategory(user.id, data);
                    } else {
                        return this.categoryService.updateCategory(user.id, data);
                    }
                }),
                first()
            )
            .subscribe(
                category => this.router.navigate(['/category']),
                error => {
                    this.error = error;
                    this.saving = false;
                }
            );
    }
}
