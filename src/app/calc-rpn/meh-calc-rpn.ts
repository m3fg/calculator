import { Operator } from "./operator"

type OpDict = { [token: string]: Operator };
export class CalcRpn {
  private operators: OpDict = [
    ['^', 4, false, Math.pow],
    ['*', 3, true, (a: number, b: number) => a * b],
    ['/', 3, true, (a: number, b: number) => a / b],
    ['+', 2, true, (a: number, b: number) => a + b],
    ['-', 2, true, (a: number, b: number) => a - b]]
    .reduce((a, o) => ({ ...a, [o[0] as string]: { token: o[0], precedence: o[1], asoc_left: o[2], func: o[3] } as Operator }), {} as OpDict);

  private operator_tokens: Set<string> = new Set([...Object.keys(this.operators), '(', ')']);

  private output: string[] = [];
  private ops: string[] = [];
  private integral: string[] = [];
  private fractional: string[] = [];

  private isFrac: boolean = false;
  private isNeg: boolean = false;

  constructor() {
    console.log(this.operators);
    console.log(this.operator_tokens);

  }

  private isNumber(char: string): boolean {
    if (char.trim() === '') {
      return false;
    }

    return !isNaN(char as any);
  }

  private opsDestack(t: string): boolean {
    if (!this.ops) {
      return false;
    }

    let s = this.ops.slice(-1)[0];
    if (s == undefined || s == '(') {
      return false;
    }

    let sOp = this.operators[s];
    let o = this.operators[t];
    if (sOp.precedence > o.precedence) {
      return true;
    }

    if (sOp.precedence == o.precedence && o.asoc_left) {
      return true;
    }

    return false;
  }

  parse(query: string): string[] {
    const input = ['', '', ...query.replace(/\s+/g, ''), '', ''];
    console.log(input);


    // const input = new Proxy([...query.replace(/\s+/g, ''), '', ''], {
    //   get(target, prop) {
    //     console.log(prop);
    //     // if (typeof prop == "number"!isNaN(prop)) {
    //     if (typeof prop == "number") {
    //       let i = parseInt(prop as string, 10);
    //       if (i < 0) {
    //         i += target.length;
    //       }
    //     }
    //     return target[i];
    //   }
    // });

    let i = -1;
    for (const t of input) {
      i++;
      if (i < 2) {
        continue
      }
      let t0 = input[i - 1];
      let t1 = input[i - 2];
      console.log(`${i}: ${t} [t0: ${t0}, t1: ${t1}]`);

      if (this.operator_tokens.has(t0) && this.operator_tokens.has(t1)) {
        if (t0 == '-') {
          this.isNeg = true;
        }
        else if (t0 == '+') {
          this.isNeg = false;
        }
        else {
          throw new Error(`Invalid consecutive tokens ${input.slice(i - 2, i)} at char ${i - 2}`);
        }
      }

      if (this.operator_tokens.has(t0) && !this.operator_tokens.has(t1)) {
        while (this.opsDestack(t0)) {
          this.output.push(this.ops.pop() as string);
        }
        this.ops.push(t0);
      }

      if (this.isNumber(t)) {
        if (this.isFrac) {
          this.fractional.push(t);
          continue
        }
        this.integral.push(t);
        continue
      }

      if (t == '.') {
        if (this.isFrac) {
          throw new Error(`Erroneous char at ${i}!`);
        }
        this.isFrac = true;
        continue
      }
      
      if (this.integral.length || this.fractional.length) {
        let out;
        if (this.isFrac) {
          out = `${this.integral.join('')}.${this.fractional.join('')}`;
          this.isFrac = false;
        }
        else {
          out = this.integral.join('');
        }

        if (this.isNeg) {
          out = `-${out}`;
          this.isNeg = false;
        }

        this.output.push(out);

        this.integral = [];
        this.fractional = [];
      }

      if (!t) {
        continue
      }

      if (t == '(') {
        this.ops.push(t);
        continue
      }

      if (t == ')') {
        while (this.ops.slice(-1)[0] != '(') {
          if (!this.ops) {
            throw new Error('Mismatched parantheses!');
          }
          this.output.push(this.ops.pop() as string);
        }

        if (this.ops.slice(-1)[0]! + '(') {
          throw new Error('Mismatched parantheses!');
        }
        this.ops.pop();
      }
    }

    while (this.ops.length) {
      if (['(', ')'].includes(this.ops.slice(-1)[0])) {
        throw new Error('Mismatched parantheses!');
      }
      this.output.push(this.ops.pop() as string);
    }

    return this.output;
  }

  inversePolishNotation() {
    return this.output;
  }

  evaluate(): number | any {
    if (!this.output.length) {
      return NaN;
    }

    let outNumbers: number[] = [];
    let outOps: string[] = [];

    let iOp = 0;
    this.output.every((v, i) => {
      if (this.operator_tokens.has(v)) {
        iOp = i;
        outNumbers = this.output
          .slice(0, iOp)
          .map(n => Number(n))
          .reverse();
        outOps = this.output.slice(iOp);
        return false;
      }
      return true;
    });

    console.log(`numbers: ${ outNumbers }`);
    console.log(`ops: ${ outOps }`);
    

    for (const op of outOps) {
      console.log(`op: ${ op }`);
      
      let o = this.operators[op];
      let val: number;
      if (o.asoc_left) {
        val = o.func(outNumbers[0], outNumbers[1]);
      }
      else {
        val = o.func(outNumbers[1], outNumbers[0]);
      }
      outNumbers = outNumbers.slice(2);
      outNumbers.unshift(val);
    }

    return outNumbers[0];
  }
}
