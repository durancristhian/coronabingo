/// <reference types="cypress" />

describe('Player without admin access', () => {
  beforeEach(() => {
    cy.prepareRoomToPlay()
  })

  it('Should persist selected numbers on reload', () => {
    cy.get('[data-test-class="cell-number"]').should(
      'not.have.class',
      'bg-orange-400',
    )

    cy.get('[data-test-class="cell-number"]').click()

    cy.get('[data-test-class="cell-number"]').should(
      'have.class',
      'bg-orange-400',
    )

    cy.reload()

    cy.get('[data-test-class="cell-number"]').should(
      'have.class',
      'bg-orange-400',
    )
  })
})
