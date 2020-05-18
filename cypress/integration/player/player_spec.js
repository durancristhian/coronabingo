/// <reference types="cypress" />

describe('Player without admin access', () => {
  beforeEach(() => {
    cy.prepareRoom()
  })

  it('Should persist selected numbers on reload', () => {
    cy.get('[data-test-class="cell-number"]')
      .eq(0)
      .should('not.have.class', 'bg-orange-400')

    cy.get('[data-test-class="cell-number"]')
      .eq(0)
      .click()

    cy.get('[data-test-class="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')

    cy.reload()

    cy.get('[data-test-class="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')
  })
})
