/// <reference types="cypress" />

describe('Admin', () => {
  beforeEach(() => {
    cy.createRoom()
  })

  it('Should have a #configure-room disabled by default', () => {
    cy.get('#configure-room').should('be.disabled')
  })

  it('Should have a #add-player disabled by default', () => {
    cy.get('#add-player').should('be.disabled')
  })

  it('Should open the share modal', () => {
    cy.get('#open-share-modal').click()

    cy.get('#modal-share').should('be.visible')

    cy.get('#close-modal').click()

    cy.get('#modal-share').should('not.be.visible')
  })

  it('Should copy room URL to clipboard', () => {
    cy.get('#open-share-modal').click()

    cy.get('#modal-share').should('be.visible')

    cy.get('#copy-to-clipboard').click()

    cy.get('#modal-share').should('not.be.visible')
  })

  it('Should open WhatsApp after its corresponding button is clicked', () => {
    cy.get('#open-share-modal').click()

    cy.get('#modal-share').should('be.visible')

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#share-whatsapp').click()

    cy.get('@windowOpen').should('be.calledWithMatch', 'whatsapp')
  })

  it('Should open Telegram after its corresponding button is clicked', () => {
    cy.get('#open-share-modal').click()

    cy.get('#modal-share').should('be.visible')

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.get('#share-telegram').click()

    cy.get('@windowOpen').should('be.calledWithMatch', 't.me')
  })

  it('Should add players to the room', () => {
    /* Keyboard */
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    /* Click */
    cy.get('#name').type('Player 3')
    cy.get('#add-player').click()

    cy.get('#players-list')
      .children()
      .should('have.length', 3)
  })

  it('Should remove a player', () => {
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    cy.get('#remove-player-2').click()

    cy.get('#players-list')
      .children()
      .should('have.length', 1)
  })

  it('Should disable submit button if there are no enough players', () => {
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    cy.get('#adminId').select('Player 1')

    cy.get('#configure-room').should('be.enabled')

    cy.get('#remove-player-2').click()

    cy.get('#configure-room').should('not.be.enabled')
  })

  it('Should enable submit button if admin is selected', () => {
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    cy.get('#adminId').select('Player 1')

    cy.get('#configure-room').should('be.enabled')
  })

  it('Should disable submit button if admin is deleted', () => {
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    cy.get('#adminId').select('Player 1')

    cy.get('#remove-player-1').click()

    cy.get('#configure-room').should('be.disabled')
  })
})
