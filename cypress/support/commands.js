// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('addPlayers', (counterStart, counterTop) => {
  for (let index = counterStart; index < counterTop; index++) {
    cy.get('#name').type(`Jugador #${index}`)
    cy.get('#add-player').click()
  }
})

Cypress.Commands.add('createRoom', () => {
  cy.visit('http://localhost:3000')

  cy.get('#name').type('Hello world')

  cy.get('#create-room').click()

  cy.wait(10000)
})

Cypress.Commands.add(
  'configureRoom',
  (isAdmin = false, hideNumbersMeaning = false) => {
    cy.createRoom()

    cy.get('#name').type('Admin{enter}')
    cy.get('#name').type('No admin #1{enter}')

    if (isAdmin) {
      cy.get('#adminId').select('Admin')
    } else {
      cy.get('#adminId').select('No admin #1')
    }

    if (hideNumbersMeaning) {
      cy.get('#hide-numbers-meaning').click()
    }

    cy.get('#configure-room').click()

    cy.wait(10000)
  },
)

Cypress.Commands.add(
  'prepareRoom',
  (isAdmin = false, hideNumbersMeaning = false) => {
    cy.configureRoom(isAdmin, hideNumbersMeaning)

    if (isAdmin) {
      cy.get('#play1').click()
    } else {
      cy.get('#play2').click()
    }

    cy.wait(10000)
  },
)
