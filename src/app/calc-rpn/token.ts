import { Tokens } from "./tokens";

export type MaybeToken = Token | null;
export interface Token {
  type: Tokens,
  value: string
}
