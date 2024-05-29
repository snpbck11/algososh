describe('Тестирование переходов по страницам', () => {
  beforeEach(() => cy.visit("/"))

  it('Главная страница', () => {
    cy.contains('МБОУ АЛГОСОШ')
  })

  it('Переход на страницу строки', () => {
    cy.get('a[href="/recursion"]').click()
    cy.contains('Строка')
  })

  it('Переход на страницу Фибоначчи', () => {
    cy.get('a[href="/fibonacci"]').click()
    cy.contains('Последовательность Фибоначчи')
  })

  it('Переход на страницу сортировки', () => {
    cy.get('a[href="/sorting"]').click()
    cy.contains('Сортировка массива')
  })

  it('Переход на страницу стека', () => {
    cy.get('a[href="/stack"]').click()
    cy.contains('Стек')
  })

  it('Переход на страницу очереди', () => {
    cy.get('a[href="/queue"]').click()
    cy.contains('Очередь')
  })

  it('Переход на страницу связного списка', () => {
    cy.get('a[href="/list"]').click()
    cy.contains('Связный список')
  })
})