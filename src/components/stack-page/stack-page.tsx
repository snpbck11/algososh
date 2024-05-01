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

interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peek: () => T | null;
  clear: () => void;
}

class Stack<T> implements IStack<T> {
  private container: (T | null)[] = [];
  getElements = () => this.container;
  getSize = () => this.container.length;
  isEmpty = () => this.container.length === 0;
  push = (item: T) => this.container.push(item);
  pop = () => {
    if (this.container.length > 0) {
      return this.container.pop();
    }
  };
  peek = () => this.container[this.container.length - 1];
  clear = () => (this.container = []);
}

const stack = new Stack<TStackElement>();

export const StackPage: React.FC = () => {
  const [value, setValue] = useState("");
  const [stackItems, setStackItems] = useState<(TStackElement | null)[]>([]);
  const [inProgress, setInProgress] = useState(false);

  const handleAddInStack = async () => {
    setInProgress(true);
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
    setInProgress(false);
  };

  const handleDelete = async () => {
    setInProgress(true);
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

    setInProgress(false);
  };

  const handleClearStack = async () => {
    setInProgress(true);
    stack.clear();
    await update([...stack.getElements()], setStackItems, SHORT_DELAY_IN_MS);
    setInProgress(false);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <SolutionLayout title="Стек">
      <div className="container">
        <div className={styles.menu}>
          <form className={styles.form}>
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
              type="button"
              text="Добавить"
              isLoader={inProgress}
              disabled={value === ""}
              onClick={handleAddInStack}
            />
            <Button
              type="button"
              text="Удалить"
              isLoader={inProgress}
              onClick={handleDelete}
            />
          </form>
          <Button
            type="button"
            text="Очистить"
            isLoader={inProgress}
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
