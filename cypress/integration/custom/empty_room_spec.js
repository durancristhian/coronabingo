/// <reference types="cypress" />

describe('Custom', () => {
  const ADMIN_NAME = 'Cristhian'
  const BASE_URL = 'https://coronabingo.now.sh' // 'http://localhost:3000'
  const ROOM_NAME = 'C3 - Jueves 21/05/2020'
  const ROOM_URL = ''

  it('Should create an minimal room ready to play', () => {
    cy.visit(BASE_URL)

    cy.get('#name').type(ROOM_NAME)

    cy.get('#create-room').click()

    cy.wait(10000)

    cy.get('#name').type(ADMIN_NAME)
    cy.get('#add-player').click()

    cy.get('#name').type('Jugador #1')
    cy.get('#add-player').click()

    cy.get('#adminId').select(ADMIN_NAME)

    cy.get('#bingo-spinner').click()

    cy.url().then(url => {
      ROOM_URL = url
    })

    cy.get('#configure-room').click()

    cy.wait(10000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 100', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(2, 100)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 200', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(100, 200)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 300', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(200, 300)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 400', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(300, 400)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 500', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(400, 500)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 600', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(500, 600)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })

  it('Should add players until reach 720', () => {
    cy.visit(ROOM_URL)

    cy.addPlayers(600, 720)

    cy.get('#configure-room').click()

    cy.wait(30000)

    cy.get('#room-name').should('have.value', ROOM_NAME)
  })
})
