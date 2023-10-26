import { Token, MaybeToken } from "./token";

export type CallableOp = (a: number, b: number) => number;
export type ContextMatcher = (prevToken: MaybeToken, hasNExt: boolean) => boolean;
export interface Operator {
  token: string,
  precedence: number,
  asoc_left: boolean
  func: CallableOp,
  matchContext: ContextMatcher
}
