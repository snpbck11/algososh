import React, { useMemo, useState } from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { Button } from "../ui/button/button";
import { ElementStates } from "../../types/element-states";
import { TStackElement } from "../../types/types";
import { update } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peek: () => T | null;
  clear: () => void;
}

class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Превышена максимальная длина");
    }
    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("Нет элементов в очереди");
    }
    this.container[this.head] = null;
    this.head++;
    this.length--;
  };

  peek = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("В очереди нет элементов");
    }
    return this.container[this.head];
  };

  clear = () => {
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };

  getHeadElement() {
    if (!this.isEmpty()) {
      return {
        index: this.head,
        value: this.container[this.head],
      };
    }
    return null;
  }

  getTailElement() {
    if (!this.isEmpty()) {
      return {
        index: this.tail - 1,
        value: this.container[this.tail - 1],
      };
    }
    return null;
  }

  isEmpty = () => this.length === 0;
  getSize = () => this.length;
  getElements = () => this.container;
}

export const QueuePage: React.FC = () => {
  const [value, setValue] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const maxSize = 7;
  const initialElements = Array.from({ length: maxSize }, () => ({
    value: "",
    state: ElementStates.Default,
  }));
  const [queueElements, setQueueElements] =
    useState<(TStackElement | null)[]>(initialElements);
  const queue = useMemo(() => new Queue<TStackElement>(maxSize), []);

  const handleAddInQueue = async () => {
    setInProgress(true);
    let tail = queue.getTailElement();
    if (tail?.value) {
      tail.value.isTail = false;
    }
    if (queue.isEmpty()) {
      queue.enqueue({
        value: value,
        state: ElementStates.Changing,
        isHead: true,
        isTail: true,
      });
    } else {
      queue.enqueue({
        value: value,
        state: ElementStates.Changing,
        isHead: false,
        isTail: true,
      });
    }
    await update([...queue.getElements()], setQueueElements, SHORT_DELAY_IN_MS);
    tail = queue.getTailElement();
    if (tail?.value) {
      tail.value.state = ElementStates.Default;
    }
    await update([...queue.getElements()], setQueueElements, SHORT_DELAY_IN_MS);
    setValue("");
    setInProgress(false);
  };

  const handleDelete = async () => {
    setInProgress(true);
    let head = queue.getHeadElement();
    let tail = queue.getTailElement();
    if (!queue.isEmpty() && head?.value) {
      head.value.state = ElementStates.Changing;
      await update(
        [...queue.getElements()],
        setQueueElements,
        SHORT_DELAY_IN_MS
      );
      head.value.isHead = false;
      queue.dequeue();
    }
    if (head?.index === tail?.index) {
      queue.clear();
    }
    head = queue.getHeadElement();
    if (!queue.isEmpty() && head?.value) {
      head.value.isHead = true;
      setQueueElements([...queue.getElements()]);
    }
    await update([...queue.getElements()], setQueueElements, SHORT_DELAY_IN_MS);
    if (head?.value) {
      head.value.state = ElementStates.Default;
    }
    setQueueElements([...queue.getElements()]);
    setValue("");
    setInProgress(false);
  };

  const handleClearQueue = async () => {
    setInProgress(true);
    queue.clear();
    await update([...initialElements], setQueueElements, SHORT_DELAY_IN_MS);
    setValue("");
    setInProgress(false);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <SolutionLayout title="Очередь">
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
              onClick={handleAddInQueue}
            />
            <Button
              type="button"
              text="Удалить"
              disabled={queue.isEmpty()}
              isLoader={inProgress}
              onClick={handleDelete}
            />
          </form>
          <Button
            type="button"
            text="Очистить"
            disabled={queue.isEmpty()}
            isLoader={inProgress}
            onClick={handleClearQueue}
          />
        </div>

        <ul className="circles">
          {queueElements.map((item, index) => (
            <Circle
              key={index}
              index={index}
              state={item?.state}
              letter={item?.value.toString()}
              head={item?.isHead ? "head" : ""}
              tail={item?.isTail ? "tail" : ""}
            />
          ))}
        </ul>
      </div>
    </SolutionLayout>
  );
};
