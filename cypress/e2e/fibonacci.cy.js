describe('Проверка работоспособности страницы "Фибоначчи"', () => {
  const fibonacciArr = ['1', '1', '2', '3', '5', '8', '13']
  beforeEach(() => {
    cy.visit('/fibonacci')
    cy.get('button[type="submit"').as('button')
    cy.get('input[placeholder="Введите число от 1 до 19"]').as('input')
  })

  it('Состояние кнопки при пустом инпуте disabled', () => {
    cy.get('@input').should('have.value', '');
    cy.get('@button').should('be.disabled')
  })
  it('Проверка корректности генерации чисел', () => {
    cy.get('@input').type('6');
    cy.get('@button').click()
    cy.get('[class*=circle_circle]').as('circles')

    cy.get('@circles').should(($circle) => {
      expect($circle).to.have.length(6)

      for (let i = 0; i < $circle.length; i++) {{
        expect($circle.eq(i)).to.contain(fibonacciArr[i])
      }}
    })
  })
})