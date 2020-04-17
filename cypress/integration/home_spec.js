/// <reference types="cypress" />

describe('Create room flow', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000')
  })

  it('Submit button should be disabled', () => {
    cy.get('#create-room').should('be.disabled')
  })

  it('Should create a room', () => {
    cy.get('#name')
      .type('Hello world')
      .should('have.value', 'Hello world')

    cy.get('#create-room')
      .should('be.enabled')
      .click()

    /*
      TODO: review this
      We're forced to wait 10 seconds because if we use cy.route Cypress
      waits also for firebase connections. I couldn't create a proper
      wildcard
    */
    cy.wait(10000)
      .url()
      .should('contain', 'room')
      .should('contain', 'admin')
  })
})
