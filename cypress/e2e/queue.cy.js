import { changing, initial } from "../constants/constants";
import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../src/constants/delays";

describe('Проверка страницы "Очередь"', () => {
  const queueArr = ["asd", "dsa", "ass"];
  beforeEach(() => {
    cy.visit("/queue");
    cy.get('input[placeholder="Введите значение"]').as("input");
    cy.get("button[type=submit]").as("add");
    cy.contains("Удалить").as("delete");
    cy.get("button[type=reset]").as("reset");
  });

  it("Состояние кнопки добавления при пустом инпуте disabled", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@add").should("be.disabled");
  });

  it("Проверка корректности добавления элементов в очередь", () => {
    cy.get("@input").type(queueArr[0]);
    cy.get("@add").click();
    cy.get('[class*="circle_circle"]').as("circles");

    cy.get("@circles").should(($circle) => {
      expect($circle.eq(0)).to.have.css("border", changing).to.contain(queueArr[0]);
      expect($circle.eq(0).prev("div")).to.contain("head");
      expect($circle.eq(0).next("p")).to.contain("0");
      expect($circle.eq(0).next("p").next("div")).to.contain("tail");
    });

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get("@circles").eq(0).should("have.css", "border", initial).and("contain", queueArr[0]);
    cy.get("@circles").eq(0).prev("div").should("contain", "head");
    cy.get("@circles").eq(0).next("p").should("contain", "0");
    cy.get("@circles").eq(0).next("p").next("div").should("contain", "tail");

    cy.get("@input").type(queueArr[1]);
    cy.get("@add").click();

    cy.get("@circles").should(($circle) => {
      expect($circle.eq(1)).to.have.css("border", changing).to.contain(queueArr[1]);
      expect($circle.eq(1).prev("div")).to.contain("");
      expect($circle.eq(1).next("p")).to.contain("1");
      expect($circle.eq(1).next("p").next("div")).to.contain("tail");
    });

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get("@circles").eq(1).should("have.css", "border", initial).and("contain", queueArr[1]);
    cy.get("@circles").eq(1).prev("div").should("contain", "");
    cy.get("@circles").eq(1).next("p").should("contain", "1");
    cy.get("@circles").eq(1).next("p").next("div").should("contain", "tail");
  });

  it("Проверка корректности удаления элемента из очереди", () => {
    queueArr.forEach((item) => {
      cy.get("@input").type(item);
      cy.get("@add").click();
      cy.wait(DELAY_IN_MS);
    });

    cy.get('[class*="circle_circle"]').as("circles");

    cy.get("@delete").click();

    cy.get("@circles").should(($circle) => {
      expect($circle.eq(0)).to.have.css("border", changing).to.contain(queueArr[0]);
      expect($circle.eq(0).prev("div")).to.contain("head");
      expect($circle.eq(0).next("p")).to.contain("0");
    });

    cy.wait(DELAY_IN_MS);

    cy.get("@circles").eq(0).should("have.css", "border", initial).and("contain", "");
    cy.get("@circles").eq(0).prev("div").should("contain", "");
    cy.get("@circles").eq(0).next("p").should("contain", "0");
    cy.get("@circles").eq(0).next("p").next("div").should("contain", "");

    cy.get("@circles").eq(1).should("have.css", "border", initial).and("contain", queueArr[1]);
    cy.get("@circles").eq(1).prev("div").should("contain", "head");
    cy.get("@circles").eq(1).next("p").should("contain", "1");
  });

  it("Проверка корректности очистки очереди", () => {
    queueArr.forEach((item) => {
      cy.get("@input").type(item);
      cy.get("@add").click();
      cy.wait(DELAY_IN_MS);
    });
    cy.get('[class*="circle_circle"]').as("circles");
    cy.get("@reset").click();

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get("@circles").then(($circle) => {
      expect(
        $circle.each((index, $el) => {
          cy.wrap($el).should("have.css", "border", initial).and("contain", "");
          cy.wrap($el).prev("div").should("contain", "");
          cy.wrap($el).next("p").should("contain", index.toString());
          cy.wrap($el).next("p").next("div").should("contain", "");
        })
      );
    });
  });
});
