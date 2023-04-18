describe('Testing the user timeline', () => {
    before(() => {
        cy.visit('/')
        cy.login('test-user', 'password123')
    })

    it('title is "Public Timeline"', () => {
        cy.contains('h2', 'My Timeline')
    })

    it('writing a tweet', () => {
        cy.intercept('POST', '/api/message').as('new-msg')

        cy.get('#twit-form').type('Super relevant message')
        cy.get('#twit-submit-btn').click()

        
    })
})