/// <reference types="cypress" />

describe('Admin', () => {
  before(() => {
    cy.server()

    cy.visit(
      `http://localhost:3000/es/room/${Cypress.env('roomId') ||
        '7JRgOvrnskGEcaAsUDJd'}/${Cypress.env('adminPlayerId')}`,
    )
  })

  it('display a new number from spinner', () => {
    cy.get('[data-test-id="next-number"]')
      .eq(1)
      .click()
  })

  it('selected numbers should persist on reload', () => {
    cy.get('[data-test-id="cell-number"]')
      .eq(0)
      .should('not.have.class', 'bg-orange-400')
    cy.get('[data-test-id="cell-number"]')
      .eq(0)
      .click()
    cy.get('[data-test-id="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')
    cy.reload()
    cy.get('[data-test-id="cell-number"]')
      .eq(0)
      .should('have.class', 'bg-orange-400')
  })

  it('Should have admin options visible', () => {
    cy.get('[data-test-id="configure-empty-cells"]')
    cy.get('[data-test-id="celebrations"]')
    cy.get('[data-test-id="sounds"]')
    cy.get('[data-test-id="reboot-game"]')
  })

  it('reboot game', () => {
    cy.get('[data-test-id="reboot-game"]')
      .eq(1)
      .click()
    cy.get('#confirm').click()
    cy.url().should('contain', 'admin')
    cy.get('#configure-room').click()
  })

  it('waiting room', () => {
    cy.url().should('not.contain', 'admin')
    cy.get('#play')
      .eq(0)
      .click()
  })
})
