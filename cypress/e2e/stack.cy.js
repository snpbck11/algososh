import { DELAY_IN_MS } from "../../src/constants/delays";
import { circles, initial } from "../constants/constants";

describe('Проверка страницы "Стек"', () => {
  const stackArr = ["asd", "dsa", "sda"];

  beforeEach(() => {
    cy.visit("/stack");
    cy.get('input[placeholder="Введите значение"]').as("input");
    cy.get("button[type=submit]").as("button");
    cy.get("button[type=reset]").as("reset");
    cy.contains("Удалить").as("delete");
  });

  it("Состояние кнопки при пустом инпуте disabled", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@button").should("be.disabled");
  });

  it("Проверка корректности добавления элементов в стек", () => {
    {
      cy.get("@input").type(stackArr[0]);
      cy.get("@button").click();
      cy.get(circles).as("circles");

      cy.get("@circles").should(($circle) => {
        expect($circle).to.have.length(1).to.contain(stackArr[0]).to.have.css("border", initial);
      });
    }
  });

  it("Проверка корректности удаления элемента из стека", () => {
    cy.get("@input").type(stackArr[0]);
    cy.get("@button").click();

    cy.get(circles).as("circles");

    cy.get("@circles").should(($circle) => {
      expect($circle).to.have.length(1).to.contain(stackArr[0]).to.have.css("border", initial);
    });

    cy.get("@delete").click();

    cy.get(circles).should("not.exist");
  });

  it("Проверка корректности очистки элементов из стека", () => {
    stackArr.forEach((item) => {
      cy.get("@input").type(item);
      cy.get("@button").click();
      cy.wait(DELAY_IN_MS);
    });

    cy.get(circles).as("circles");

    cy.get("@circles").should(($circle) => {
      expect($circle).to.have.length(stackArr.length);
    });

    cy.get("@reset").click();
    cy.get("@circles").should("not.exist");
  });
});
