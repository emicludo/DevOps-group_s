describe('Signing up', () => {
    beforeEach(() => {
        cy.visit('/signup')
    })

    it('title is "Sign Up"', () => {
        cy.contains('h2', 'Sign Up')
    })

    // it('sign-up with correct data', () => {
    //     cy.intercept('POST', '/signup').as('new-user')

    //     cy.get('#username-signup-form').type('John Johnson')
    //     cy.get('#email-signup-form').type('john@johnson.com')
    //     cy.get('#password-signup-form').type('password123')
    //     cy.get('#password2-signup-form').type('password123')
    //     cy.get('#signup-btn').click()
    //     cy.contains('h2', 'My Timeline') // test this 
    // })

    it('sign-up with incorrect mail gives error', () => {
        cy.intercept('POST', '/signup').as('new-user')

        cy.get('#username-signup-form').type('John Johnson')
        cy.get('#email-signup-form').type('johnson.com')
        cy.get('#password-signup-form').type('password123')
        cy.get('#password2-signup-form').type('password123')
        cy.get('#signup-btn').click()
        cy.get('#error-msg-signup').should('be.visible')
        cy.contains('#error-msg-signup', 'Error: You have to enter a valid email address')  
    })

    it('sign-up with no password gives error', () => {
        cy.intercept('POST', '/signup').as('new-user')

        cy.get('#username-signup-form').type('John Johnson')
        cy.get('#email-signup-form').type('john@johnson.com')
        cy.get('#signup-btn').click()
        cy.get('#error-msg-signup').should('be.visible')
        cy.contains('#error-msg-signup', 'Error: You have to enter a password')  
    })

    it('sign-up with unmatching passwords gives error', () => {
        cy.intercept('POST', '/signup').as('new-user')

        cy.get('#username-signup-form').type('John Johnson')
        cy.get('#email-signup-form').type('john@johnson.com')
        cy.get('#password-signup-form').type('password123')
        cy.get('#password2-signup-form').type('password321')
        cy.get('#signup-btn').click()
        cy.get('#error-msg-signup').should('be.visible')
        cy.contains('#error-msg-signup', 'Error: The two passwords do not match')  
    })
})