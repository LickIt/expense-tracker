import { Component, Input, OnDestroy, ElementRef, forwardRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { FormGroup, FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { colorPalette } from '../../../common/color.palette';


@Component({
    selector: 'app-category-color-input',
    templateUrl: 'category-color.input.component.html',
    styleUrls: ['category-color.input.component.css'],
    providers: [{ provide: MatFormFieldControl, useExisting: CategoryColorInputComponent }, {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => CategoryColorInputComponent),
    }],
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '[class.floating]': 'shouldLabelFloat',
        '[id]': 'id',
        '[attr.aria-describedby]': 'describedBy',
    }
})
export class CategoryColorInputComponent implements MatFormFieldControl<string>, OnDestroy, ControlValueAccessor {
    static nextId = 0;

    stateChanges = new Subject<void>();
    autofilled?: boolean;
    focused = false;
    ngControl = null;
    errorState = false;
    controlType = 'app-category-color-input';
    id = `app-category-color-input-${CategoryColorInputComponent.nextId++}`;
    describedBy = '';

    public color: string = null;
    public colors = Array.from(colorPalette.entries());
    _onChange: (_: any) => void;
    _onTouched: any;

    get empty() {
        return !this.color;
    }

    get shouldLabelFloat() { return this.focused || !this.empty; }

    @Input()
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    private _placeholder: string;

    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _required = false;

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _disabled = false;

    @Input()
    get value(): string | null {
        return this.color;
    }
    set value(color: string | null) {
        this.color = color;
        if (this._onChange) {
            this._onChange(color);
        }
        if (this._onTouched) {
            this._onTouched();
        }
        this.stateChanges.next();
    }

    constructor(private fm: FocusMonitor, private elRef: ElementRef) {
        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();
        });
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.fm.stopMonitoring(this.elRef.nativeElement);
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    onContainerClick(event: MouseEvent) {
    }


    // ControlValueAccessor interface
    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: (_: any) => void): void {
        this._onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // control
    updateColor(color: string) {
        this.value = color;
    }
}
