import renderer from "react-test-renderer";
import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "./button";

describe("Тест кнопки", () => {
  it("Кнопка c текстом рендерится без ошибок", () => {
    const button = renderer.create(<Button text="Кнопка" />).toJSON();
    expect(button).toMatchSnapshot();
  });
  it("Кнопка без текста рендерится без ошибок", () => {
    const button = renderer.create(<Button text="" />).toJSON();
    expect(button).toMatchSnapshot();
  });
  it("Заблокированная кнопка рендерится без ошибок", () => {
    const button = renderer.create(<Button disabled />).toJSON();
    expect(button).toMatchSnapshot();
  });
  it("Кнопка с индикацией загрузки рендерится без ошибок", () => {
    const button = renderer.create(<Button isLoader />).toJSON();
    expect(button).toMatchSnapshot();
  });
  it("Нажатие на кнопку вызывает корректный alert", () => {
    window.alert = jest.fn();
    render(<Button text="Вызов коллбека" onClick={() => alert("По кнопке кликнули")} />);
    const button = screen.getByText("Вызов коллбека");
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith("По кнопке кликнули");
  });
});
