import { Circle } from "./circle";
import renderer from "react-test-renderer";
import { fireEvent, screen, render } from "@testing-library/react";

describe("Тест компонента Circle", () => {
  it("Circle рендерится без ошибок без буквы", () => {
    const circle = renderer.create(<Circle />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с буквами", () => {
    const circle = renderer.create(<Circle letter="абв"/>).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с head", () => {
    const circle = renderer.create(<Circle head="абв"/>).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с компонентом в head", () => {
    const circle = renderer.create(<Circle head={<Circle/>} />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с tail", () => {
    const circle = renderer.create(<Circle tail="абв" />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с компонентом в tail", () => {
    const circle = renderer.create(<Circle tail={<Circle />} />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с index", () => {
    const circle = renderer.create(<Circle index={1} />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок с пропопм isSmall === true", () => {
    const circle = renderer.create(<Circle isSmall />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок в состоянии default", () => {
    const circle = renderer.create(<Circle state="default" />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок в состоянии changing", () => {
    const circle = renderer.create(<Circle state="changing" />).toJSON();
    expect(circle).toMatchSnapshot();
  });
  it("Circle рендерится без ошибок в состоянии modified", () => {
    const circle = renderer.create(<Circle state="modified" />).toJSON();
    expect(circle).toMatchSnapshot();
  });
});
