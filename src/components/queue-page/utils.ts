interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peek: () => T | null;
  clear: () => void;
}

export class Queue<T> implements IQueue<T> {
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