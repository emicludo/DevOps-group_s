describe('Testing the public timeline', () => {
    before(() => {
        cy.visit('/')
    })

    it('title is "Public Timeline"', () => {
        cy.contains('h2', 'Public Timeline')
    })
})