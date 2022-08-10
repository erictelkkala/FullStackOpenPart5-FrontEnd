import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('Renders url and likes when clicked', async () => {
  // User setup
  const user = userEvent.setup()
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

  // Find the button to expand the blog
  const button = screen.getByText('Expand')
  await user.click(button)

  // Find the div that the url and likes are in
  const hiddenDiv = container.querySelector('.hidden')
  expect(hiddenDiv).toBeVisible()

  // Find the url and likes
  const url = container.querySelector('.blogURL')
  expect(url).toHaveTextContent('https://www.robertcmartin.com/')
  const likes = container.querySelector('.likes')
  expect(likes).toHaveTextContent('0 likes')
})

test('Clicking the like button twice sends the event twice to the event handler', async () => {
  // User setup
  const user = userEvent.setup()
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
  render(<Blog blog={blog} like={handleLike} remove={handleRemove} />)

  // Find the button to expand the blog
  const button = screen.getByText('Expand')
  await user.click(button)

  // Find the like button
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  // Check that the event handler was called twice
  expect(handleLike.mock.calls.length).toBe(2)
})
