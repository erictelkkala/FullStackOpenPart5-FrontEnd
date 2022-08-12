describe('Blog testing', () => {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // User that is added to the database before each test
    const user = {
      name: 'root',
      username: 'root',
      password: 'secret',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('Login for is visible', () => {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.contains('login').should('be.visible')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.contains('login').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials', () => {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.contains('login').click()
      cy.get('.error').contains('Wrong username or password')
      // Check that the error is displayed in red
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})
