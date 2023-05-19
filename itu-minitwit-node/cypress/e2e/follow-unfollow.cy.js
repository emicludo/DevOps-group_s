import '../support/commands'

describe('When not logged in', () => {
    
    it('title is "My Timeline"', () => {
        cy.visit('/Nelson%20Moron')
        cy.contains('h2', 'My Timeline')
    })
})

describe('When logged in', () => {
    beforeEach(() => {
        cy.login('test-user', 'password123')
    })

    it('not yet following user', () => {
        cy.visit('/Carlos%20Giggey') 
        cy.contains('#followstatus-div', 'You are not yet following this user.')
        cy.get('#follow-btn').should('be.visible')
    })

    it('clicking follow, changes status', () => {
        cy.visit('/Carlos%20Giggey') 
        cy.get('#follow-btn').click()
        cy.contains('#followstatus-div', 'You are currently following this user.')
        cy.get('#unfollow-btn').should('be.visible')
    })

    it('clicking unfollow, changes status', () => {
        cy.visit('/Carlos%20Giggey') 
        cy.get('#follow-btn').click()
        cy.get('#unfollow-btn').click()
        cy.contains('#followstatus-div', 'You are not yet following this user.')
        cy.get('#follow-btn').should('be.visible')
    })
})