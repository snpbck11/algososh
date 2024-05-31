import { stringSwap } from "./stringSwap";

describe("Тест разворота строки", () => {
  it("Корректно разворачивает строку с четным количеством символов", () => {
    expect(stringSwap("hell")).toEqual(["l", "l", "e", "h"]);
  });
  it("Корректно разворачивает строку с нечетным количеством символов", () => {
    expect(stringSwap("hello")).toEqual(["o", "l", "l", "e", "h"]);
  });
  it("Корректно разворачивает строку с одним символов", () => {
    expect(stringSwap("h")).toEqual(["h"]);
  });
  it("Корректно разворачивает пустую строку", () => {
    expect(stringSwap("")).toEqual([]);
  });
});
