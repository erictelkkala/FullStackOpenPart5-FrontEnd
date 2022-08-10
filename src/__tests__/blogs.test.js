import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from '../components/Blog'

// Mock functions
const handleLike = jest.fn()
const handleRemove = jest.fn()

test('Renders title and author, but not url and likes', async () => {
  const blog = {
    title: 'Test title',
    author: 'Robert C. Martin',
    url: 'https://www.robertcmartin.com/',
    likes: 0,
    user: {
      name: 'Robert C. User',
    },
  }

  // Feed the blog and the mock functions to the component
  const { container } = render(
    <Blog blog={blog} like={handleLike} remove={handleRemove} />
  )

  // Find the div that the title and author are in
  const div = container.querySelector('.Title_and_author')
  expect(div).toHaveTextContent('Test title Robert C. Martin')

  // Find the div that the url and likes are in
  const hiddenDiv = container.querySelector('.hidden')
  expect(hiddenDiv).not.toBeVisible()
})
