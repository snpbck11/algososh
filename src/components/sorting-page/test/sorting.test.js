import { Direction } from "../../../types/direction";
import { bubbleSort, selectionSort } from "./sort";

describe("Тест сортировки пузырьком:", () => {
  it("Корректно отсортирован пустой массив по возрастанию", () => {
    expect(bubbleSort([], Direction.Ascending)).toEqual([]);
    expect(selectionSort([], Direction.Ascending)).toEqual([]);
  });
  it("Корректно отсортирован пустой массив по убыванию", () => {
    expect(bubbleSort([], Direction.Descending)).toEqual([]);
    expect(selectionSort([], Direction.Descending)).toEqual([]);
  });
  it("Корректно отсортирован по возрастанию массив из одного элемента", () => {
    expect(bubbleSort([5], Direction.Ascending)).toEqual([5]);
    expect(selectionSort([5], Direction.Ascending)).toEqual([5]);
  });
  it("Корректно отсортирован по убыванию массив из одного элемента", () => {
    expect(bubbleSort([5], Direction.Descending)).toEqual([5]);
    expect(selectionSort([5], Direction.Descending)).toEqual([5]);
  });
  it("Корректно отсортирован по возрастанию массив из нескольких элементов", () => {
    expect(bubbleSort([3, 2, 4, 6, 5, 1], Direction.Ascending)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(selectionSort([3, 2, 4, 6, 5, 1], Direction.Ascending)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("Корректно отсортирован по убыванию массив из нескольких элементов", () => {
    expect(bubbleSort([3, 2, 4, 6, 5, 1], Direction.Descending)).toEqual([6, 5, 4, 3, 2, 1]);
    expect(selectionSort([3, 2, 4, 6, 5, 1], Direction.Descending)).toEqual([6, 5, 4, 3, 2, 1]);
  });
});
