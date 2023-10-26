import { Pipe, PipeTransform } from '@angular/core';
import { parse } from './calc-rpn';

@Pipe({
  standalone: true,
  name: 'displayRPN'
})
export class DisplayRPNPipe implements PipeTransform {

  transform(input: string): string {
    let rpn = '';
    try {
      rpn = parse(input).rpn;
    } catch (error: unknown) {
      if (error instanceof Error) return error.message;
      return String(error)
    }

    // console.log(rpn);
    return rpn;
  }

}
