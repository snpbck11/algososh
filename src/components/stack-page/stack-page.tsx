import React, { useState } from "react";
import styles from "./stack-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { TStackElement } from "../../types/types";
import { ElementStates } from "../../types/element-states";
import { update } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Stack } from "./utils";

const stack = new Stack<TStackElement>();

export const StackPage: React.FC = () => {
  const [value, setValue] = useState("");
  const [stackItems, setStackItems] = useState<(TStackElement | null)[]>([]);
  const [inProgress, setInProgress] = useState({add: false, delete: false, clear: false});

  const handleAddInStack = async () => {
    setInProgress({...inProgress, add: true});
    let lastElement = stack.peek();
    if (!stack.isEmpty() && lastElement) {
      lastElement.isHead = false;
    }
    stack.push({
      value: value,
      state: ElementStates.Changing,
      isHead: true,
    });
    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);
    lastElement = stack.peek();
    if (!stack.isEmpty() && lastElement) {
      lastElement.state = ElementStates.Default;
    }
    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);
    setValue("");
    setInProgress({...inProgress, add: false});
  };

  const handleDelete = async () => {
    setInProgress({...inProgress, delete: true});
    let lastElement = stack.peek();
    if (!stack.isEmpty() && lastElement) {
      lastElement.state = ElementStates.Changing;
    }

    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);
    stack.pop();
    lastElement = stack.peek();
    if (!stack.isEmpty() && lastElement) {
      lastElement.state = ElementStates.Default;
      lastElement.isHead = true;
    }

    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);

    setInProgress({...inProgress, delete: false});
  };

  const handleClearStack = async () => {
    setInProgress({...inProgress, clear: true});
    stack.clear();
    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);
    setInProgress({...inProgress, clear: false});
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddInStack()
  }

  return (
    <SolutionLayout title="Стек">
      <div className="container">
        <div className={styles.menu}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              value={value}
              type="text"
              placeholder="Введите значение"
              maxLength={4}
              minLength={1}
              isLimitText={true}
              required
              onChange={handleChange}
            />
            <Button
              type="submit"
              text="Добавить"
              isLoader={inProgress.add}
              disabled={value === "" || value.length > 4 || inProgress.add}
            />
            <Button
              type="button"
              text="Удалить"
              isLoader={inProgress.delete}
              onClick={handleDelete}
              disabled={stackItems.length <= 0}
            />
          </form>
          <Button
            type="reset"
            text="Очистить"
            disabled={stackItems.length <= 0}
            isLoader={inProgress.clear}
            onClick={handleClearStack}
          />
        </div>

        <ul className="circles">
          {stackItems.map((item, index) => (
            <Circle
              key={index}
              index={index}
              state={item?.state}
              letter={item?.value.toString()}
              head={item?.isHead ? "top" : ""}
            />
          ))}
        </ul>
      </div>
    </SolutionLayout>
  );
};
