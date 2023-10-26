import { parse } from './calc-rpn';

const testCases = {
  '0 + 1 * 2 ^ 3': ['0 1 2 3 ^ * +', 0],
  '1+2*3-4': ['1 2 3 * + 4 -', 0],
  '-1+1': ['-1 1 +', 0],
  '*-1': ['', 0],
  '*1+1': ['', 0]
}

describe('CalcRpn', () => {
  it('should match js eval', () => {
    for (const [query, val] of Object.entries(testCases)) {
      expect(parse(query) === val[0]).toBeTrue();
    }
    // expect(new CalcRpn()).toBeTruthy();
  });
});
