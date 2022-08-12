describe('Blog testing', () => {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
  })

  it('Login for is visible', () => {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.contains('login').should('be.visible')
  })

  describe('Login', () => {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      // User that is added to the database before each test
      const user = {
        name: 'root',
        username: 'root',
        password: 'secret',
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
    })
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

  describe('When logged in', () => {
    // Create a user before the tests
    before(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      // User that is added to the database before each test
      const user = {
        name: 'root',
        username: 'root',
        password: 'secret',
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
    })
    // Login before each test
    beforeEach(function () {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.contains('login').click()
      cy.contains('root logged in')
    })

    it('A blog can be created', () => {
      cy.contains('Add a new blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Robert C. Martin')
      cy.get('#url').type('https://www.robertcmartin.com/')
      // Specify the test to look into the form element for the button
      // There is a title that contains the word 'create' outside the form that the test will default to
      cy.get('form').contains('create').click()
      // Same logic for the article element
      cy.get('article').contains('Test title')
    })

    it('User can like a blog', () => {
      cy.contains('Expand').click()
      const initialLikes = 0
      cy.contains('Like').click()
      // Assert that the likes count is increased by 1
      cy.contains(`${initialLikes + 1} likes`)
    })
  })
})
