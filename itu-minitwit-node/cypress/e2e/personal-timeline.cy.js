import '../support/commands'

describe('Testing the user timeline', () => {
    beforeEach(() => {
        cy.login('test-user', 'password123')
    })

    it('title is "My Timeline"', () => {
        cy.visit('/')
        cy.contains('h2', 'My Timeline')
    })

    // it('writing a tweet', () => {
    //     cy.intercept('POST', '/api/message').as('new-msg')
    //     cy.visit('/')
    //     cy.get('#twit-form').type('Super relevant message').should('have-value', 'Super relevant message')
    //     cy.get('#twit-submit-btn').click()
    // })

    // it('writing a tweet, displays the tweet', () => {
    //     cy.intercept('POST', '/api/message').as('new-msg')
    //     cy.visit('/')
    //     cy.get('#twit-form').type('Super relevant message')
    //     cy.get('#twit-submit-btn').click()
    // })
})