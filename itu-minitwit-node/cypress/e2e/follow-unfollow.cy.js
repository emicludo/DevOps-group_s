import '../support/commands'

describe('When logged in', () => {
    beforeEach(() => {
        cy.login('test-user', 'password123')
    })

    it('not yet following user', () => {
        cy.visit('/Ileen%20Creps') 
        cy.contains('#followstatus-div', 'You are not yet following this user.')
        cy.get('#follow-btn').should('be.visible')
    })

    it('clicking follow, changes status', () => {
        cy.visit('/Ileen%20Creps') 
        cy.get('#follow-btn').click()
        cy.contains('#followstatus-div', 'You are currently following this user.')
        cy.get('#unfollow-btn').should('be.visible')
    })

    it('clicking unfollow, changes status', () => {
        cy.visit('/Ileen%20Creps') 
        cy.get('#unfollow-btn').click()
        cy.contains('#followstatus-div', 'You are not yet following this user.')
        cy.get('#follow-btn').should('be.visible')
    })
})