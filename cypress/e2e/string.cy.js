import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {initial, changing, modified} from "../constants/constants"

describe("Тестирование страницы строки", () => {
  const inputString = "hello";


  beforeEach(() => {
    cy.visit("/recursion");
    cy.get('button[type="submit"]').as("button");
    cy.get('input[placeholder="Введите текст"]').as("input");
  });

  it("Состояние кнопки при пустом инпуте", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@button").should("be.disabled");
  });

  it("Проверка корректности разворота строки", () => {
    cy.get("@input").type(inputString);
    cy.get("@button").click();
    cy.get(circles).as("circles");

    cy.get("@circles").should(($circle) => {
      expect($circle).to.have.length(inputString.length);
      expect($circle.eq(0)).to.contain(inputString[0]).to.have.css("border", changing);
      expect($circle.eq(1)).to.contain(inputString[1]).to.have.css("border", initial);
      expect($circle.eq(2)).to.contain(inputString[2]).to.have.css("border", initial);
      expect($circle.eq(3)).to.contain(inputString[3]).to.have.css("border", initial);
      expect($circle.eq(4)).to.contain(inputString[4]).to.have.css("border", changing);
    });

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get("@circles").should(($circle) => {
      expect($circle).to.have.length(inputString.length);
      expect($circle.eq(0)).to.contain(inputString[4]).to.have.css("border", modified);
      expect($circle.eq(1)).to.contain(inputString[1]).to.have.css("border", changing);
      expect($circle.eq(2)).to.contain(inputString[2]).to.have.css("border", initial);
      expect($circle.eq(3)).to.contain(inputString[3]).to.have.css("border", changing);
      expect($circle.eq(4)).to.contain(inputString[0]).to.have.css("border", modified);
    });

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get("@circles").should(($circle) => {
      expect($circle).to.have.length(inputString.length);
      expect($circle.eq(0)).to.contain(inputString[4]).to.have.css("border", modified);
      expect($circle.eq(1)).to.contain(inputString[3]).to.have.css("border", modified);
      expect($circle.eq(2)).to.contain(inputString[2]).to.have.css("border", modified);
      expect($circle.eq(3)).to.contain(inputString[1]).to.have.css("border", modified);
      expect($circle.eq(4)).to.contain(inputString[0]).to.have.css("border", modified);
    });
  });
});
