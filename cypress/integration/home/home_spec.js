/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
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

    cy.wait(10000)
      .url()
      .should('contain', 'room')
      .should('contain', 'admin')
  })

  it('Should open a modal to show the tutorial', () => {
    cy.get('#watch-tutorial').click()

    cy.get('#modal-how-to-play').should('be.visible')

    cy.get('#close-modal').click()

    cy.get('#modal-how-to-play').should('not.be.visible')
  })
})
