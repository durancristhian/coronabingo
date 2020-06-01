/// <reference types="cypress" />

describe('Numbers meaning', () => {
  it('Should appear when enabled', () => {
    cy.prepareRoom(true)

    cy.get('#next-number')
      .should('exist')
      .click()

    cy.get('#number-meaning').should('exist')
  })

  it('Should not exist when disabled', () => {
    cy.prepareRoom(true, true)

    cy.get('#next-number')
      .should('exist')
      .click()

    cy.get('#number-meaning').should('not.exist')
  })
})
