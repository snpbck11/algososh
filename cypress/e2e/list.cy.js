import { changing, circles, circlesSmall, initial, modified } from "../constants/constants";
import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../src/constants/delays";

describe('Проверка работоспособности страницы "Список"', () => {
  const initialArr = ["10", "2", "31", "12"];
  const initialValue = "asd";
  const initialIndex = 2;

  beforeEach(() => {
    cy.visit("/list");
    cy.contains("Добавить в head").as("addInHead");
    cy.contains("Добавить в tail").as("addInTail");
    cy.contains("Удалить из head").as("deleteFromHead");
    cy.contains("Удалить из tail").as("deleteFromTail");
    cy.contains("Добавить по индексу").as("addByIndex");
    cy.contains("Удалить по индексу").as("deleteByIndex");
    cy.get('input[placeholder="Введите значение"]').as("inputValue");
    cy.get('input[placeholder="Введите индекс"]').as("inputIndex");
  });

  it("Состояние кнопок добавления, и добавления и удаления по индексу при пустых инпутах disabled, дефолтный список отрисован корректно", () => {
    cy.get("@inputValue").should("have.value", "");
    cy.get("@inputIndex").should("have.value", "");
    cy.get("@addInHead").should("be.disabled");
    cy.get("@addInTail").should("be.disabled");
    cy.get("@addByIndex").should("be.disabled");
    cy.get("@deleteByIndex").should("be.disabled");

    cy.get(circles).as("circles");

    cy.get("@circles").then(($circle) => {
      expect(
        $circle.each((index, $el) => {
          cy.wrap($el).should("have.css", "border", initial).and("contain", initialArr[index]);
          cy.wrap($el).next("p").should("contain", index.toString());
        })
      );
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.eq(3).next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности добавления элемента в head", () => {
    cy.get("@inputValue").type(initialValue);
    cy.get("@addInHead").click();
    cy.get(circles).as("circles");
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    cy.get("@circles").first().should("have.css", "border", modified).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    const modifiedArr = [initialValue, ...initialArr];

    cy.get("@circles").then(($circle) => {
      expect(
        $circle.each((index, $el) => {
          cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
        })
      );
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности добавления элемента в tail", () => {
    cy.get("@inputValue").type(initialValue);
    cy.get("@addInTail").click();
    cy.get(circles).as("circles");
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    cy.get("@circles").last().should("have.css", "border", modified).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    const modifiedArr = [...initialArr, initialValue];

    cy.get("@circles").then(($circle) => {
      expect(
        $circle.each((index, $el) => {
          cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
        })
      );
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности добавления элемента по индексу", () => {
    cy.get("@inputValue").type(initialValue);
    cy.get("@inputIndex").type(initialIndex);
    cy.get("@addByIndex").click();
    cy.get(circles).as("circles");
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    cy.get("@circles").eq(initialIndex).should("have.css", "border", modified).and("have.text", initialValue);

    cy.wait(SHORT_DELAY_IN_MS);
    const modifiedArr = [...initialArr];
    modifiedArr.splice(initialIndex, 0, initialValue);

    cy.get("@circles").then(($circle) => {
      expect(
        $circle.each((index, $el) => {
          cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
        })
      );
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности удаления элемента из head", () => {
    cy.get("@deleteFromHead").click();
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialArr[0]);

    cy.wait(DELAY_IN_MS * 2);

    const modifiedArr = [...initialArr];
    modifiedArr.splice(0, 1);

    cy.get(circles).then(($circle) => {
      $circle.each((index, $el) => {
        cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
      });
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности удаления элемента из tail", () => {
    const indexOfLastElemetn = initialArr.length - 1;

    cy.get("@deleteFromTail").click();
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialArr[indexOfLastElemetn]);

    cy.wait(DELAY_IN_MS * 2);

    const modifiedArr = [...initialArr];
    modifiedArr.splice(indexOfLastElemetn, 1);

    cy.get(circles).then(($circle) => {
      $circle.each((index, $el) => {
        cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
      });
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });

  it("Проверка корректности удаления элемента по индексу", () => {
    cy.get("@inputIndex").type(initialIndex);
    cy.get("@deleteByIndex").click();
    cy.get(circlesSmall).should("have.css", "border", changing).and("have.text", initialArr[initialIndex]);

    cy.wait(DELAY_IN_MS * 3);

    const modifiedArr = [...initialArr];
    modifiedArr.splice(initialIndex, 1);

    cy.get(circles).then(($circle) => {
      $circle.each((index, $el) => {
        cy.wrap($el).should("have.css", "border", initial).and("have.text", modifiedArr[index]);
      });
      cy.wrap($circle.first().prev("div")).should("contain", "head");
      cy.wrap($circle.last().next("p").next("div")).should("contain", "tail");
    });
  });
});
