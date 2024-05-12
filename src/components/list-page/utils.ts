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

export class LinkedList<T> implements ILinkedList<T> {
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