/// <reference types="cypress" />

describe('Footer', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Should have a link to my twitter account', () => {
    cy.get('#my-twitter')
      .should('have.attr', 'href')
      .and('include', 'twitter')
      .and('include', 'DuranCristhian')
  })

  it('Should open the donate modal', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('be.visible')
    cy.get('#donate-cafecito').should('be.visible')
    cy.get('#donate-paypal').should('be.visible')

    cy.get('#close-modal').click()

    cy.get('#modal-donate').should('not.be.visible')
  })

  it('Should open Cafecito after its corresponding button is clicked', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('be.visible')

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#donate-cafecito')
      .should('be.visible')
      .click()

    cy.get('@windowOpen').should('be.calledWithMatch', 'cafecito')
  })

  it('Should open Paypal after its corresponding button is clicked', () => {
    cy.get('#donate').click()

    cy.get('#modal-donate').should('be.visible')

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#donate-paypal')
      .should('be.visible')
      .click()

    cy.get('@windowOpen').should('be.calledWithMatch', 'paypal')
  })

  it('Should have a link to google forms', () => {
    cy.get('#feedback-form')
      .should('have.attr', 'href')
      .and('include', 'forms')
  })

  it(`Should have a link to Coronabingo's twitter account`, () => {
    cy.get('#coronabingo-twitter')
      .should('have.attr', 'href')
      .and('include', 'twitter')
      .and('include', 'corona_bingo')
  })
})
