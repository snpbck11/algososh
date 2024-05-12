import React, { useEffect, useState } from "react";
import styles from "./sorting-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import {
  getBubbleSort,
  getRandomInt,
  getSelectionSort,
  update,
} from "../../utils/utils";
import { ElementStates } from "../../types/element-states";
import { TElement } from "../../types/types";
import { DELAY_IN_MS } from "../../constants/delays";
import { Sort } from "../../types/sort";
import { Direction } from "../../types/direction";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";

export const SortingPage: React.FC = () => {
  const [arr, setArr] = useState<(TElement | null)[]>([]);
  const [inProgress, setInProgress] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const [sortSelect, setSortSelect] = useState<Sort | null>(null);

  const getRandomArr = () => {
    const minLen = 3;
    const maxLen = 17;
    const minValue = 0;
    const maxValue = 100;

    const randomArr = Array.from(
      { length: getRandomInt(minLen, maxLen) },
      () => ({
        value: getRandomInt(minValue, maxValue),
        state: ElementStates.Default,
      })
    );
    setArr([...randomArr]);
  };

  const selectSortArr = async (isAscending: boolean) => {
    const steps = getSelectionSort(arr, isAscending);
    let currentStep = 0;
    while (currentStep < steps.length) {
      if (steps) {
        await update([...steps[currentStep]], setArr, DELAY_IN_MS);
        currentStep++;
      }
    }
  };

  const bubbleSortArr = async (isAscending: boolean) => {
    const steps = getBubbleSort(arr, isAscending);
    let currentStep = 0;
    while (currentStep < steps.length) {
      if (steps) {
        await update([...steps[currentStep]], setArr, DELAY_IN_MS);
        currentStep++;
      }
    }
  };

  const sortArr = async (isAscending: boolean) => {
    setInProgress(true);
    if (sortSelect === Sort.Select) {
      await selectSortArr(isAscending);
    }
    if (sortSelect === Sort.Bubble) {
      await bubbleSortArr(isAscending);
    }
    setInProgress(false);
  };

  const handleSort = (direction: Direction) => {
    setInProgress(true);
    setIsAscending(direction === Direction.Ascending);
    setIsAscending((prevState) => {
      sortArr(prevState);
      return prevState;
    });
    setInProgress(false);
  };

  const onChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "select") {
      return setSortSelect(Sort.Select);
    } else {
      return setSortSelect(Sort.Bubble);
    }
  };

  useEffect(() => {
    setSortSelect(Sort.Select);
    getRandomArr();
  }, []);

  return (
    <SolutionLayout title="Сортировка массива">
      <div className="container">
        <div className={styles.menu}>
          <div className={styles.select}>
            <RadioInput
              label="Выбор"
              name="select"
              onChange={onChangeRadio}
              checked={sortSelect === Sort.Select}
            />
            <RadioInput
              label="Пузырёк"
              name="bubble"
              onChange={onChangeRadio}
              checked={sortSelect === Sort.Bubble}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              text="По возрастанию"
              sorting={Direction.Ascending}
              disabled={inProgress}
              isLoader={inProgress && isAscending}
              onClick={() => handleSort(Direction.Ascending)}
            />
            <Button
              text="По убыванию"
              sorting={Direction.Descending}
              disabled={inProgress}
              isLoader={inProgress && !isAscending}
              onClick={() => handleSort(Direction.Descending)}
            />
          </div>
          <Button
            text="Новый массив"
            disabled={inProgress}
            onClick={getRandomArr}
          />
        </div>
        <div className={styles.bars}>
          {arr?.map((item, index) => (
            <Column
              index={parseInt(item!.value.toString())}
              state={item?.state}
              key={index}
            />
          ))}
        </div>
      </div>
    </SolutionLayout>
  );
};
