describe('Signing up', () => {
    before(() => {
        cy.visit('/signup')
    })

    it('title is "Sign Up"', () => {
        cy.contains('h2', 'Sign Up')
    })

    
})