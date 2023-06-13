describe('Signing in', () => {
    beforeEach(() => {
        cy.visit('/signin')
    })

    it('title is "Sign In"', () => {
        cy.contains('h2', 'Sign In')
    })

    it('right information gives no error and logs in', () => {
        cy.get('#username').type('test-user')
        cy.get('#password').type('password123')
        cy.get('#submit-btn').click()
        cy.contains('h2', 'My Timeline')
    })

    it('no information gives error', () => {
        cy.get('#submit-btn').click()
        cy.get('#error-msg').should('be.visible')
    })

    it('wrong username gives error', () => {
        cy.get('#username').type('wrong-username')
        cy.get('#password').type('superstrongpassword123')
        cy.get('#submit-btn').click()
        cy.get('#error-msg').should('be.visible')
        cy.contains('#error-msg', 'Error: Incorrect username')  
    })

    it('wrong password gives error', () => {
        cy.get('#username').type('test-user')
        cy.get('#password').type('akjsdklajdklasjæd')
        cy.get('#submit-btn').click()
        cy.get('#error-msg').should('be.visible')
        cy.contains('#error-msg', 'Error: Invalid password')  
    })
})

// describe('Signing out', () => {
//     it('clicking "sign out" signs you out', () => {
//         cy.login('test-user', 'password123')
//         cy.visit('/')
//         cy.get('#sign-out').click()
//         cy.contains('#message', 'You were logged out')
//     })
// })