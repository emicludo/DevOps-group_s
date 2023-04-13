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

Cypress.Commands.add('login', (username, password) => {
    cy.session([username, password], () => {
      cy.visit('/signin')
      cy.get('#username-form').type(username)
      cy.get('#password-form').type(password)
      cy.get('#submit-btn').click()
      cy.contains('h2', 'My Timeline')
    })
  })