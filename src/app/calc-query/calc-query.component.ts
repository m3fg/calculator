import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { parse, Output } from '../calc-rpn/calc-rpn';
import { DisplayRPNPipe } from '../calc-rpn/display-rpn.pipe';

@Component({
  selector: 'app-calc-query',
  templateUrl: './calc-query.component.html',
  styleUrls: ['./calc-query.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayRPNPipe
  ],
})
export class CalcQueryComponent implements OnInit{

  private inputSub: any;
  public input: FormControl;
  public output: Output;

  constructor(private _ngZone: NgZone) {
    this.input = new FormControl('0 + 1 * 2 ^ 3', [allowedCharsValidator()]);
    this.output = parse(this.input.value);
  }

  ngOnInit() {
    this.inputSub = this.input.valueChanges.subscribe((val: string) => {
      this.output = parse(val);
    });
  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
  }
}

export function myParse(i: string) {
  return parse(i);
}

export function allowedCharsValidator(): ValidatorFn {
  let allowedRe = /[^\+\-\*\/\ ()^0-9]/g;
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = [...control.value.matchAll(allowedRe)].flatMap(e => `${e[0]}(${e.index + 1})`).join(', ');
    console.log(forbidden);

    return forbidden ? { forbiddenChars: { value: forbidden } } : null;
  };
}
