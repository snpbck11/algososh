import { ElementStates } from "./element-states";
import { Position } from "./position";

export type TElement = {
  value: number | string;
  state: ElementStates;
};

export type TStackElement = TElement & {
  isHead?: boolean;
  isTail?: boolean;
  isLinked?: boolean;
  newValue?: number | string;
  position?: Position;
  changingPosition?: boolean;
};
