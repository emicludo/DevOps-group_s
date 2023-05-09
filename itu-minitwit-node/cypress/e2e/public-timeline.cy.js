describe('Testing the public timeline', () => {
    // before(() => {
    //     cy.visit('/public')
    // })

    it('title is "Public Timeline"', () => {
        cy.visit('/public')
        cy.contains('h2', 'Public Timeline')
    })

    // it('shows received tweets', () => {
    //     cy.intercept('GET', '/public', {}).as('tweets')

    //     cy.wait('@tweets').then(x => {
    //         cy.log(JSON.stringify(x))
    //         console.log(JSON.stringify(x))
    //     })
    // })

})