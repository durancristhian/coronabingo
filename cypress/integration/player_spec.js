/// <reference types="cypress" />

describe('Admin', () => {
  beforeEach(() => {
    cy.server()

    const configuredRoom = Cypress.env('configuredRoom')
    const roomId = configuredRoom.id
    const adminId = configuredRoom.adminId

    cy.visit(`http://localhost:3000/es/room/${roomId}/${adminId}`)

    /* TODO: ultra hardcoded */
    /* cy.get('[for="banana8"]').click()
    cy.get('[for="basketball6"]').click()
    cy.get('[for="game_die2"]').click()

    cy.get('#submit-code').click() */
  })

  it('Should display a new number from bingo spinner', () => {
    cy.get('[id="next-number"]')
      .eq(0)
      .click()
  })

  it('Should persist selected numbers on reload', () => {
    cy.get('[id="cell-number"]')
      .eq(0)
      .should('not.have.class', 'bg-orange-400')

    cy.get('[id="cell-number"]')
      .eq(0)
      .click()

    cy.get('[id="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')

    cy.reload()

    /* TODO: ultra hardcoded */
    /* cy.get('[for="banana8"]').click()
    cy.get('[for="basketball6"]').click()
    cy.get('[for="game_die2"]').click()

    cy.get('#submit-code').click() */

    cy.get('[id="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')
  })

  it('Should have admin options visible', () => {
    cy.get('[id="configure-empty-cells"]')
    cy.get('[id="celebrations"]')
    cy.get('[id="sounds"]')
    cy.get('[id="reboot-game"]')
  })

  it.only('Should reboot game', () => {
    cy.get('[id="reboot-game"]')
      .eq(0)
      .click()

    cy.get('#confirm').click()

    cy.url().should('contain', 'admin')

    cy.get('#configure-room').click()
  })
})
