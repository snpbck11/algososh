import React, { useEffect, useMemo, useState } from "react";
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { TStackElement } from "../../types/types";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ElementStates } from "../../types/element-states";
import { update } from "../../utils/utils";
import { DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";

class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

interface ILinkedList<T> {
  append: (element: T) => void;
  getSize: () => number;
}

class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;

  constructor(array?: T[]) {
    this.head = null;
    this.size = 0;
    array?.forEach((node) => this.append(node));
  }

  append(element: T) {
    const node = new Node(element);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current?.next) {
        current = current.next;
      }
      if (current) {
        current.next = new Node(element);
      }
    }
    this.size++;
  }

  prepend(element: T) {
    const node = new Node(element);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  getByIndex(position: number) {
    if (position < 0 || position > this.size) {
      throw new Error("Такого индекса не существует");
    }
    let current = this.head;
    let index = 0;
    while (index < position) {
      current = current ? current.next : null;
      index++;
    }
    return current ? current.value : null;
  }

  addByIndex(position: number, value: T) {
    if (position < 0 || position > this.size) {
      throw new Error("Такого индекса не существует");
    }
    const node = new Node(value);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;
      let prev = null;
      let index = 0;
      while (index < position) {
        prev = current;
        current = current ? current.next : null;
        index++;
      }
      if (prev) {
        prev.next = node;
      }
      node.next = current;
    }
    this.size++;
  }

  removeByIndex(position: number) {
    if (position < 0 || position > this.size) {
      throw new Error("Такого индекса не существует");
    }
    let current = this.head;
    if (position === 0 && current) {
      this.head = current.next;
    } else {
      let prev = null;
      let index = 0;
      while (index < position) {
        prev = current;
        current = current ? current.next : null;
        index++;
      }
      if (prev && current) {
        prev.next = current.next;
      }
    }
    this.size--;
    return current ? current.value : null;
  }

  removeHead = () => {
    let temp = this.head;
    if (temp) {
      this.head = temp.next;
      this.size--;
      return;
    }
  };

  removeTail = () => {
    if (!this.head || !this.head.next) {
      return null;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = null;
    this.size--;
    return current ? current.value : null;
  };

  isEmpty = () => this.size === 0;

  getSize = () => this.size;
}

export const ListPage: React.FC = () => {
  const initialList = useMemo(() => ["10", "2", "31", "12"], []);
  const list = useMemo(
    () => new LinkedList<string | number>(initialList),
    [initialList]
  );
  const initialListArray: TStackElement[] = useMemo(() => [], []);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState<number>(0);
  const [listElements, setListElements] = useState<(TStackElement | null)[]>(
    []
  );
  const [inProgress, setInProgress] = useState(false);

  const handleAddInHead = async () => {
    setInProgress(true);
    listElements[0]!.isHead = false;
    listElements[0]!.isLinked = true;
    listElements[0]!.changingPosition = true;
    listElements[0]!.newValue = value;
    await update([...listElements], setListElements, DELAY_IN_MS);
    listElements[0]!.changingPosition = false;
    list.prepend(value);
    const head = list.getByIndex(0);
    listElements.unshift({
      value: head ? head : "",
      state: ElementStates.Modified,
      isHead: true,
      isLinked: true,
    });
    setListElements([...listElements]);
    listElements[0]!.state = ElementStates.Default;
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleAddInTail = async () => {
    setInProgress(true);
    let tailIndex = list.getSize() - 1;
    if (tailIndex === 0) {
      listElements[tailIndex]!.isHead = false;
    }
    listElements[tailIndex]!.isTail = false;
    listElements[tailIndex]!.isLinked = true;
    listElements[tailIndex]!.changingPosition = true;
    listElements[tailIndex]!.newValue = value;
    await update([...listElements], setListElements, DELAY_IN_MS);
    listElements[tailIndex]!.changingPosition = false;
    listElements[0]!.isHead = true;
    list.append(value);
    const tail = list.getByIndex(tailIndex);
    listElements.push({
      value: tail ? tail : "",
      state: ElementStates.Modified,
      isTail: true,
      isLinked: true,
    });
    setListElements([...listElements]);
    tailIndex = list.getSize() - 1;
    listElements[tailIndex]!.state = ElementStates.Default;
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleDeleteFromHead = async () => {
    setInProgress(true);
    listElements[0]!.changingPosition = true;
    listElements[0]!.newValue = listElements[0]!.value;
    listElements[0]!.value = "";
    await update([...listElements], setListElements, DELAY_IN_MS);
    listElements[0]!.changingPosition = false;
    list.removeHead();
    listElements.shift();
    listElements[0]!.isHead = true;
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleDeleteFromTail = async () => {
    setInProgress(true);
    listElements[list.getSize() - 1]!.changingPosition = true;
    listElements[list.getSize() - 1]!.newValue =
      listElements[list.getSize() - 1]!.value;
    listElements[list.getSize() - 1]!.value = "";
    listElements[list.getSize() - 1]!.isTail = false;
    await update([...listElements], setListElements, DELAY_IN_MS);
    listElements[list.getSize() - 1]!.changingPosition = false;
    list.removeTail();
    listElements.pop();
    listElements[list.getSize() - 1]!.isTail = true;
    listElements[list.getSize() - 1]!.isLinked = false;
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleAddByIndex = async () => {
    setInProgress(true);
    list.addByIndex(index, value);
    for (let i = 0; i <= index; i++) {
      listElements[i]!.state = ElementStates.Changing;
      listElements[i]!.changingPosition = true;
      listElements[i]!.newValue = value;
      listElements[i]!.isHead = false;
      await update([...listElements], setListElements, DELAY_IN_MS);
      listElements[i]!.changingPosition = false;
      if (index !== 0) {
        listElements[0]!.isHead = true;
      }
    }
    const insertedNode = list.getByIndex(index);
    listElements.splice(index, 0, {
      value: insertedNode ? insertedNode : "",
      state: ElementStates.Modified,
      isLinked: true,
    });
    listElements[0]!.isHead = true;
    listElements[list.getSize() - 1]!.isTail = true;
    setListElements([...listElements]);
    for (let i = 0; i <= index + 1; i++) {
      listElements[i]!.state = ElementStates.Default;
    }
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleDeleteByIndex = async () => {
    setInProgress(true);
    list.removeByIndex(index);
    for (let i = 0; i <= index; i++) {
      listElements[i]!.state = ElementStates.Changing;
      listElements[i]!.changingPosition = true;
      listElements[i]!.isTail = false;
      setListElements([...listElements]);
      if (i === index) {
        const value = listElements[i]!.value;
        listElements[i]!.value = "";
        await update([...listElements], setListElements, DELAY_IN_MS);
        listElements[i]!.newValue = value;
      }
      await update([...listElements], setListElements, DELAY_IN_MS);
      listElements[i]!.changingPosition = false;
      setListElements([...listElements]);
    }
    listElements.splice(index, 1);
    listElements[0]!.isHead = true;
    listElements[list.getSize() - 1]!.isTail = true;
    listElements[list.getSize() - 1]!.isLinked = false;
    setListElements([...listElements]);
    for (let i = 0; i < index; i++) {
      listElements[i]!.state = ElementStates.Default;
    }
    setInProgress(false);
    setIndex(0);
    setValue("");
  };

  const handleChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleChangeIndex = (e: React.FormEvent<HTMLInputElement>) => {
    setIndex(parseInt(e.currentTarget.value));
  };

  const setColor = (item: TStackElement) => {
    return item?.state === ElementStates.Changing ? "#d252e1" : "#0032ff";
  };

  useEffect(() => {
    initialList.forEach((element) => {
      initialListArray.push({
        value: element,
        state: ElementStates.Default,
        isHead: false,
        isTail: false,
        isLinked: true,
      });
    });
    initialListArray[0].isHead = true;
    initialListArray[initialListArray.length - 1].isTail = true;
    initialListArray[initialListArray.length - 1].isLinked = false;
    setListElements(initialListArray);
  }, [list, initialListArray, initialList]);

  return (
    <SolutionLayout title="Связный список">
      <div className="container">
        <form className={styles.form}>
          <div className={styles.inputs}>
            <Input
              placeholder="Введите значение"
              type="text"
              maxLength={4}
              value={value}
              onChange={handleChangeValue}
              minLength={1}
              disabled={inProgress}
              isLimitText={true}
            />
            <Input
              placeholder="Введите индекс"
              type="number"
              value={index}
              disabled={inProgress}
              onChange={handleChangeIndex}
            />
          </div>
          <div className={styles.container}>
            <div className={styles.buttons}>
              <Button
                text="Добавить в head"
                onClick={handleAddInHead}
                disabled={value === ""}
                isLoader={inProgress}
              />
              <Button
                text="Добавить в tail"
                onClick={handleAddInTail}
                isLoader={inProgress}
                disabled={value === ""}
              />
              <Button
                text="Удалить из head"
                onClick={handleDeleteFromHead}
                isLoader={inProgress}
                disabled={list.isEmpty()}
              />
              <Button
                text="Удалить из tail"
                onClick={handleDeleteFromTail}
                isLoader={inProgress}
                disabled={list.isEmpty()}
              />
            </div>
            <div className={styles.buttons}>
              <Button
                text="Добавить по индексу"
                extraClass={styles.big}
                onClick={handleAddByIndex}
                isLoader={inProgress}
                disabled={value === ""}
              />
              <Button
                text="Удалить по индексу"
                extraClass={styles.big}
                onClick={handleDeleteByIndex}
                isLoader={inProgress}
                disabled={list.isEmpty()}
              />
            </div>
          </div>
        </form>
        <ul className="circles">
          {listElements.map((item, index) => (
            <li className={styles.item} key={index}>
              <div className={styles.circles}>
                <Circle
                  index={index}
                  state={item?.state}
                  letter={item?.value.toString()}
                  head={item?.isHead ? "head" : ""}
                  tail={item?.isTail ? "tail" : ""}
                  extraClass={styles.circle}
                />
                {item?.changingPosition && (
                  <Circle
                    state={ElementStates.Changing}
                    letter={item?.newValue?.toString()}
                    isSmall={true}
                    extraClass={styles.small}
                  />
                )}
              </div>
              {item?.isLinked && !item?.isTail && (
                <ArrowIcon fill={setColor(item)} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </SolutionLayout>
  );
};
