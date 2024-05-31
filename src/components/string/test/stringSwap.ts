export const stringSwap = (str: string) => {
  const array = str.split('');

  const end = str.length - 1;
  const mid = Math.ceil(str.length / 2);
  for (let i = 0; i < mid; i++) {
    let j = end - i;
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array;
};