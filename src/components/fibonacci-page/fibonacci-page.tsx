import { FC, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { ElementStates } from "../../types/element-states";
import { TElement } from "../../types/types";
import { update } from "../../utils/utils";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

const getFiboncciSequence = (n: number) => {
  let sequence: number[] = [1, 1];
  if (n < 3) return [1];
  for (let i = 2; i <= n; i++) {
    sequence.push(
      sequence[sequence.length - 1] + sequence[sequence.length - 2]
    );
  }
  return sequence;
};

export const FibonacciPage: FC = () => {
  const [number, setNumber] = useState(-1);
  const [generatedNumbers, setGeneratedNumbers] = useState<(TElement | null)[]>(
    []
  );
  const [inProgress, setInProgress] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setNumber(parseFloat(e.currentTarget.value));
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    generateFibonacci();
  };

  const generateFibonacci = async () => {
    setInProgress(true);
    const fibonacciNumbers = number ? [...getFiboncciSequence(number)] : [];
    const numbers: TElement[] = [];
    for (let i = 0; i < fibonacciNumbers.length; i++) {
      numbers.push({
        value: fibonacciNumbers[i].toString(),
        state: ElementStates.Default,
      });
      await update(numbers, setGeneratedNumbers, SHORT_DELAY_IN_MS);
    }
    setInProgress(false);
    setNumber(-1);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className="container">
        <form className="form" onSubmit={onSubmit}>
          <Input
            placeholder="Введите число от 1 до 19"
            type="number"
            min={1}
            max={19}
            maxLength={2}
            isLimitText={true}
            onChange={handleChange}
          />
          <Button
            text="Рассчитать"
            type="submit"
            disabled={inProgress}
            isLoader={inProgress}
          />
        </form>
        <ul className="circles">
          {generatedNumbers.slice(0, 10).map((number, index) => (
            <Circle
              key={index}
              index={index}
              state={number?.state}
              letter={number?.value.toString()}
            />
          ))}
        </ul>
        <ul className="circles">
          {generatedNumbers.slice(10, 20).map((number, index) => (
            <Circle
              key={index}
              index={index + 10}
              state={number?.state}
              letter={number?.value.toString()}
            />
          ))}
        </ul>
      </div>
    </SolutionLayout>
  );
};
