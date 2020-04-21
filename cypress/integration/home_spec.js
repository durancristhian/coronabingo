/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000')
  })

  it('Should have a disabled submit button when loaded', () => {
    cy.get('#create-room').should('be.disabled')
  })

  it('Should create a room', () => {
    cy.get('#name')
      .type('Hello world')
      .should('have.value', 'Hello world')

    cy.get('#create-room')
      .should('be.enabled')
      .click()

    cy.wait(5000)
      .url()
      .should('contain', 'room')
      .should('contain', 'admin')
  })
})
