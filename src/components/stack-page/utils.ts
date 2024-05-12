interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peek: () => T | null;
  clear: () => void;
}

export class Stack<T> implements IStack<T> {
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