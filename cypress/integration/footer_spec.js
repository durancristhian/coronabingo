/// <reference types="cypress" />

describe('Footer', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000')
  })

  it('Should have a link to google forms', () => {
    cy.get('#feedback-form')
      .should('have.attr', 'href')
      .and('include', 'forms')
  })

  it('Should have a link to my twitter account', () => {
    cy.get('#my-twitter')
      .should('have.attr', 'href')
      .and('include', 'twitter')
  })

  it('Should open the donate modal', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('have.length', 1)

    cy.get('#donate-mercado-pago').should('have.length', 1)
    cy.get('#donate-paypal').should('have.length', 1)

    cy.get('#close-modal').click()

    cy.get('#modal-donate').should('have.length', 0)
  })

  it('Should open mercado pago after its corresponding button is clicked', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('have.length', 1)

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#donate-mercado-pago')
      .should('have.length', 1)
      .click()

    cy.get('@windowOpen').should('be.calledWithMatch', 'mercadopago')
  })

  it('Should open paypal after its corresponding button is clicked', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('have.length', 1)

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#donate-paypal')
      .should('have.length', 1)
      .click()

    cy.get('@windowOpen').should('be.calledWithMatch', 'paypal')
  })
})
