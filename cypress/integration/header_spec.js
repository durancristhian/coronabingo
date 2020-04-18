/// <reference types="cypress" />

describe('Create room flow', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000')
  })

  it('Should change language URL', () => {
    cy.get('#language').select('en')

    cy.wait(5000)
      .url()
      .should('contain', 'en')
  })
})
