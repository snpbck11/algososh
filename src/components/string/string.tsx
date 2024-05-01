import React, { FC, useState } from "react";
import { Button } from "../../components/ui/button/button";
import { Circle } from "../../components/ui/circle/circle";
import { Input } from "../../components/ui/input/input";
import { SolutionLayout } from "../../components/ui/solution-layout/solution-layout";
import { ElementStates } from "../../types/element-states";
import { TElement } from "../../types/types";
import { swap, update } from "../../utils/utils";
import { DELAY_IN_MS } from "../../constants/delays";

const reverseString = (string: string) => {
  const letters = string.split("");
  const steps: string[][] = [];

  let start = 0;
  let end = letters.length - 1;

  while (start <= end) {
    if (end === start) {
      steps.push([...letters]);
      break;
    } else {
      swap(letters, start, end);
      steps.push([...letters]);
      start++;
      end--;
    }
  }
  return steps;
};

export const StringComponent: FC = () => {
  const [string, setString] = useState("");
  const [letters, setLetters] = useState<(TElement | null)[]>([]);
  const [inProgress, setInProgress] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setString(e.currentTarget.value);
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    reverse();
  };

  const reverse = async () => {
    setInProgress(true);
    const inputLetters: TElement[] = [];
    string.split("").forEach((element) => {
      inputLetters.push({ value: element, state: ElementStates.Default });
    });

    const steps = reverseString(string);
    let currentStep = 0;
    while (currentStep < steps.length) {
      if (steps) {
        await update([...inputLetters], setLetters, DELAY_IN_MS);
        let leftIndex = currentStep;
        let rightIndex = inputLetters.length - currentStep - 1;
        inputLetters[leftIndex].state = ElementStates.Changing;
        inputLetters[rightIndex].state = ElementStates.Changing;
        await update([...inputLetters], setLetters, DELAY_IN_MS);
        inputLetters[leftIndex].state = ElementStates.Modified;
        inputLetters[rightIndex].state = ElementStates.Modified;
        inputLetters[leftIndex].value = steps[currentStep][leftIndex];
        inputLetters[rightIndex].value = steps[currentStep][rightIndex];
        currentStep++;
      }
    }
    setInProgress(false);
    setString("");
  };

  return (
    <SolutionLayout title="Строка">
      <div className="container">
        <form className="form" onSubmit={onSubmit}>
          <Input
            value={string}
            isLimitText={true}
            maxLength={11}
            onChange={handleChange}
          />
          <Button
            type="submit"
            text="Развернуть"
            disabled={inProgress}
            isLoader={inProgress}
          />
        </form>
        <ul className="circles">
          {letters.map((letter, index) => (
            <Circle
              state={letter?.state}
              letter={letter?.value.toString()}
              key={index}
            />
          ))}
        </ul>
      </div>
    </SolutionLayout>
  );
};
