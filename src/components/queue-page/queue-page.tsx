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
import { Queue } from "./utils";


export const QueuePage: React.FC = () => {
  const [value, setValue] = useState("");
  const [inProgress, setInProgress] = useState({add: false, delete: false, clear: false});  const maxSize = 7;
  const initialElements = Array.from({ length: maxSize }, () => ({
    value: "",
    state: ElementStates.Default,
  }));
  const [queueElements, setQueueElements] =
    useState<(TStackElement | null)[]>(initialElements);
  const queue = useMemo(() => new Queue<TStackElement>(maxSize), []);

  const handleAddInQueue = async () => {
    setInProgress({...inProgress, add: true});
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
    setInProgress({...inProgress, add: false});
  };

  const handleDelete = async () => {
    setInProgress({...inProgress, delete: true});
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
    setInProgress({...inProgress, delete: false});
  };

  const handleClearQueue = async () => {
    setInProgress({...inProgress, clear: true});
    queue.clear();
    await update([...initialElements], setQueueElements, SHORT_DELAY_IN_MS);
    setValue("");
    setInProgress({...inProgress, clear: false});
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddInQueue()
  }

  return (
    <SolutionLayout title="Очередь">
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
              disabled={value === ""}
            />
            <Button
              type="button"
              text="Удалить"
              disabled={queue.isEmpty()}
              isLoader={inProgress.delete}
              onClick={handleDelete}
            />
          </form>
          <Button
            type="button"
            text="Очистить"
            disabled={queue.isEmpty()}
            isLoader={inProgress.clear}
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
