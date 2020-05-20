/// <reference types="cypress" />

describe('Header', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Should change language URL', () => {
    cy.get('#language').select('en')

    cy.wait(10000)
      .url()
      .should('contain', 'en')
  })
})
