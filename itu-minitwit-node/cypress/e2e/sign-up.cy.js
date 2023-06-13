describe('Signing up', () => {
    beforeEach(() => {
        cy.visit('/signup')
    })

    it('title is "Sign Up"', () => {
        cy.contains('h2', 'Sign Up')
    })

    // it('sign-up with correct data', () => {
    //     // cy.intercept('POST', '/signup').as('new-user')
    //     cy.intercept('POST', '/signup', { statusCode: 200, body: { message: 'User created successfully!' } }).as('signup')

    //     cy.get('#username-signup-form').type('ok')
    //     cy.get('#email-signup-form').type('ok@ok.com')
    //     cy.get('#password-signup-form').type('ok')
    //     cy.get('#password2-signup-form').type('ok')
    //     cy.get('#signup-btn').click()
    //     // cy.contains('h2', 'My Timeline') // test this 

    //     cy.wait('@signup').then((interception) => {
    //         expect(interception.response.statusCode).to.equal(200)
    //         expect(interception.response.body.message).to.equal('User created successfully!')
    //       })
    // })

    it('sign-up with incorrect mail gives error', () => {
        cy.get('#username').type('John Johnson')
        cy.get('#email').type('johnson.com')
        cy.get('#password').type('password123')
        cy.get('#password2').type('password123')
        cy.get('#signup-btn').click()
        cy.get('#error-msg').should('be.visible')
        cy.contains('#error-msg', 'Error: You have to enter a valid email address')  
    })

    it('sign-up with no password gives error', () => {
        cy.get('#username').type('John Johnson')
        cy.get('#email').type('john@johnson.com')
        cy.get('#signup-btn').click()
        cy.get('#error-msg').should('be.visible')
        cy.contains('#error-msg', 'Error: You have to enter a password')  
    })

    it('sign-up with unmatching passwords gives error', () => {
        cy.get('#username').type('John Johnson')
        cy.get('#email').type('john@johnson.com')
        cy.get('#password').type('password123')
        cy.get('#password2').type('password321')
        cy.get('#signup-btn').click()
        cy.get('#error-msg').should('be.visible')
        cy.contains('#error-msg', 'Error: The two passwords do not match')  
    })

    // it('sign-up with already existing user gives error', () => {
    //     cy.get('#username').type('ok')
    //     cy.get('#email').type('ok@ok.com')
    //     cy.get('#password').type('ok')
    //     cy.get('#password2').type('ok')
    //     cy.get('#signup-btn').click()
    //     cy.get('#error-msg').should('be.visible')
    //     cy.contains('#error-msg', 'Error: The username is already taken')  
    // })
})