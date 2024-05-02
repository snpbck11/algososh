import { ElementStates } from "../types/element-states";
import { TElement } from "../types/types";

export const swap = <T>(arr: T[], firstIndex: number, secondIndex: number) => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

export const update = async (
  elements: (TElement | null)[],
  setState: (state: (TElement | null)[]) => void,
  delay: number
) => {
  const timeout = () => new Promise((resolve) => setTimeout(resolve, delay));

  await timeout();
  if (elements) {
    setState([...elements]);
  }
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * ((max - min + 1) | 0) + min;
};

export const getSelectionSort = (
  arrToSort: (TElement | null)[],
  isAscending: boolean
) => {
  const arr = arrToSort ? [...arrToSort] : [];
  const steps: (TElement | null)[][] = [];
  if (isAscending) {
    for (let i = 0; i < arr.length - 1; i++) {
      let indToSwap = i;
      arr[i] = {
        ...arr[i],
        state: ElementStates.Changing,
      } as TElement;
      for (let j = i + 1; j < arr.length; j++) {
        arr[j] = {
          ...arr[j],
          state: ElementStates.Changing,
        } as TElement;
        steps.push([...arr]);
        if (arr[j]!.value < arr[indToSwap]!.value) {
          indToSwap = j;
        }
        arr[j] = {
          ...arr[j],
          state: ElementStates.Default,
        } as TElement;
      }
      arr[i] = {
        ...arr[i],
        state: ElementStates.Default,
      } as TElement;
      swap(arr, i, indToSwap);
      arr[i] = {
        ...arr[i],
        state: ElementStates.Modified,
      } as TElement;
    }
    arr[arr.length - 1] = {
      ...arr[arr.length - 1],
      state: ElementStates.Modified,
    } as TElement;
    steps.push([...arr]);
  } else {
    for (let i = 0; i < arr.length - 1; i++) {
      let indToSwap = i;
      arr[i] = {
        ...arr[i],
        state: ElementStates.Changing,
      } as TElement;
      for (let j = i + 1; j < arr.length; j++) {
        arr[j] = {
          ...arr[j],
          state: ElementStates.Changing,
        } as TElement;
        steps.push([...arr]);
        if (arr[j]!.value > arr[indToSwap]!.value) {
          indToSwap = j;
        }
        arr[j] = {
          ...arr[j],
          state: ElementStates.Default,
        } as TElement;
      }
      arr[i] = {
        ...arr[i],
        state: ElementStates.Default,
      } as TElement;
      swap(arr, i, indToSwap);
      arr[i] = {
        ...arr[i],
        state: ElementStates.Modified,
      } as TElement;
    }
    arr[arr.length - 1] = {
      ...arr[arr.length - 1],
      state: ElementStates.Modified,
    } as TElement;
    steps.push([...arr]);
  }
  return steps;
};

export const getBubbleSort = (
  arrToSort: (TElement | null)[],
  isAscending: boolean
) => {
  const arr = [...arrToSort];
  const steps: (TElement | null)[][] = [];
  if (isAscending) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j] = {
          ...arr[j],
          state: ElementStates.Changing,
        } as TElement;
        arr[j + 1] = {
          ...arr[j + 1],
          state: ElementStates.Changing,
        } as TElement;
        steps.push([...arr]);
        if (arr[j]!.value > arr[j + 1]!.value) {
          swap(arr, j, j + 1);
          steps.push([...arr]);
        }
        arr[j] = {
          ...arr[j],
          state: ElementStates.Default,
        } as TElement;
        arr[j + 1] = {
          ...arr[j + 1],
          state: ElementStates.Default,
        } as TElement;
      }
      arr[arr.length - i - 1] = {
        ...arr[arr.length - i - 1],
        state: ElementStates.Modified,
      } as TElement;
      arr[arr.length - 1] = {
        ...arr[arr.length - 1],
        state: ElementStates.Modified,
      } as TElement;
      steps.push([...arr]);
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j] = {
          ...arr[j],
          state: ElementStates.Changing,
        } as TElement;
        arr[j + 1] = {
          ...arr[j + 1],
          state: ElementStates.Changing,
        } as TElement;
        steps.push([...arr]);
        if (arr[j]!.value < arr[j + 1]!.value) {
          swap(arr, j, j + 1);
          steps.push([...arr]);
        }
        arr[j] = {
          ...arr[j],
          state: ElementStates.Default,
        } as TElement;
        arr[j + 1] = {
          ...arr[j + 1],
          state: ElementStates.Default,
        } as TElement;
      }
      arr[arr.length - i - 1] = {
        ...arr[arr.length - i - 1],
        state: ElementStates.Modified,
      } as TElement;
    }
    arr[arr.length - 1] = {
      ...arr[arr.length - 1],
      state: ElementStates.Modified,
    } as TElement;
    steps.push([...arr]);
  }
  return steps;
};
