import { render, screen } from '@testing-library/react'
import React from 'react'
import C from '../src'

test('C', () => {
  const text = 'text'
  render(<C text={text} />)
  expect(screen.getByText(text)).toBeVisible()
})
