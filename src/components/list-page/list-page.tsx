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
import { LinkedList } from "./utils";

export const ListPage: React.FC = () => {
  const initialList = useMemo(() => ["10", "2", "31", "12"], []);
  const list = useMemo(
    () => new LinkedList<string | number>(initialList),
    [initialList]
  );
  const initialListArray: TStackElement[] = useMemo(() => [], []);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [listElements, setListElements] = useState<(TStackElement | null)[]>(
    []
  );
  const [inProgress, setInProgress] = useState({
    addInHead: false,
    addInTail: false,
    deleteFromHead: false,
    deleteFromTail: false,
    addByIndex: false,
    deleteByIndex: false,
  });

  const handleAddInHead = async () => {
    setInProgress({ ...inProgress, addInHead: true });
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
    setInProgress({ ...inProgress, addInHead: false });
    setIndex("");
    setValue("");
  };

  const handleAddInTail = async () => {
    setInProgress({ ...inProgress, addInTail: true });
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
    setInProgress({ ...inProgress, addInTail: false });
    setIndex("");
    setValue("");
  };

  const handleDeleteFromHead = async () => {
    setInProgress({ ...inProgress, deleteFromHead: true });
    listElements[0]!.changingPosition = true;
    listElements[0]!.newValue = listElements[0]!.value;
    listElements[0]!.value = "";
    await update([...listElements], setListElements, DELAY_IN_MS);
    listElements[0]!.changingPosition = false;
    list.removeHead();
    listElements.shift();
    listElements[0]!.isHead = true;
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress({ ...inProgress, deleteFromHead: false });
    setIndex("");
    setValue("");
  };

  const handleDeleteFromTail = async () => {
    setInProgress({ ...inProgress, deleteFromTail: true });
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
    setInProgress({ ...inProgress, deleteFromTail: false });
    setIndex("");
    setValue("");
  };

  const handleAddByIndex = async () => {
    setInProgress({ ...inProgress, addByIndex: true });
    const number = parseFloat(index);
    list.addByIndex(number, value);
    for (let i = 0; i <= number; i++) {
      listElements[i]!.state = ElementStates.Changing;
      listElements[i]!.changingPosition = true;
      listElements[i]!.newValue = value;
      listElements[i]!.isHead = false;
      await update([...listElements], setListElements, DELAY_IN_MS);
      listElements[i]!.changingPosition = false;
      if (number !== 0) {
        listElements[0]!.isHead = true;
      }
    }
    const insertedNode = list.getByIndex(number);
    listElements.splice(number, 0, {
      value: insertedNode ? insertedNode : "",
      state: ElementStates.Modified,
      isLinked: true,
    });
    listElements[0]!.isHead = true;
    listElements[list.getSize() - 1]!.isTail = true;
    setListElements([...listElements]);
    for (let i = 0; i <= number + 1; i++) {
      listElements[i]!.state = ElementStates.Default;
    }
    await update([...listElements], setListElements, DELAY_IN_MS);
    setInProgress({ ...inProgress, addByIndex: false });
    setIndex("");
    setValue("");
  };

  const handleDeleteByIndex = async () => {
    setInProgress({ ...inProgress, deleteByIndex: true });
    const number = parseFloat(index);
    list.removeByIndex(number);
    for (let i = 0; i <= number; i++) {
      listElements[i]!.state = ElementStates.Changing;
      listElements[i]!.changingPosition = true;
      listElements[i]!.isTail = false;
      setListElements([...listElements]);
      if (i === number) {
        const value = listElements[i]!.value;
        listElements[i]!.value = "";
        await update([...listElements], setListElements, DELAY_IN_MS);
        listElements[i]!.newValue = value;
      }
      await update([...listElements], setListElements, DELAY_IN_MS);
      listElements[i]!.changingPosition = false;
      setListElements([...listElements]);
    }
    listElements.splice(number, 1);
    listElements[0]!.isHead = true;
    listElements[list.getSize() - 1]!.isTail = true;
    listElements[list.getSize() - 1]!.isLinked = false;
    setListElements([...listElements]);
    for (let i = 0; i < number; i++) {
      listElements[i]!.state = ElementStates.Default;
    }
    setInProgress({ ...inProgress, deleteByIndex: false });
    setIndex("");
    setValue("");
  };

  const handleChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleChangeIndex = (e: React.FormEvent<HTMLInputElement>) => {
    setIndex(e.currentTarget.value);
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
              isLimitText={true}
            />
            <Input
              placeholder="Введите индекс"
              type="number"
              value={index}
              onChange={handleChangeIndex}
            />
          </div>
          <div className={styles.container}>
            <div className={styles.buttons}>
              <Button
                text="Добавить в head"
                onClick={handleAddInHead}
                disabled={value === ""}
                isLoader={inProgress.addInHead}
              />
              <Button
                text="Добавить в tail"
                onClick={handleAddInTail}
                isLoader={inProgress.addInTail}
                disabled={value === ""}
              />
              <Button
                text="Удалить из head"
                onClick={handleDeleteFromHead}
                isLoader={inProgress.deleteFromHead}
                disabled={list.isEmpty()}
              />
              <Button
                text="Удалить из tail"
                onClick={handleDeleteFromTail}
                isLoader={inProgress.deleteFromTail}
                disabled={list.isEmpty()}
              />
            </div>
            <div className={styles.buttons}>
              <Button
                text="Добавить по индексу"
                extraClass={styles.big}
                onClick={handleAddByIndex}
                isLoader={inProgress.addByIndex}
                disabled={
                  value === "" ||
                  index === "" ||
                  parseFloat(index) > listElements.length - 1
                }
              />
              <Button
                text="Удалить по индексу"
                extraClass={styles.big}
                onClick={handleDeleteByIndex}
                isLoader={inProgress.deleteByIndex}
                disabled={
                  list.isEmpty() ||
                  parseFloat(index) < 0 ||
                  parseFloat(index) > listElements.length - 1 ||
                  index === ""
                }
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
