describe('Signing up', () => {
    before(() => {
        cy.visit('/signup')
    })

    it('title is "Sign Up"', () => {
        cy.contains('h2', 'Sign Up')
    })

    // it('sign-up with correct data', () => {
    //     cy.intercept('POST', '/signup').as('new-user')

    //     cy.get('#username-form').type('test-user')
    //     cy.get('#password-form').type('password123')
    //     cy.get('#submit-btn').click()
    //     cy.contains('h2', 'My Timeline')
    // })
    
})