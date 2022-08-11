describe('Blog testing', () => {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login for is visible', () => {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.contains('login').should('be.visible')
  })
})
