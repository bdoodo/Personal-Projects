import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'


test('displays images', async () => {
  render(<App/>)

  const words = ['witch', 'pumpkin', 'skeleton']

  words.forEach(word => {//input words to analyze
    fireEvent.input(screen.getByRole('textbox'), {target: {value: word}})
  })

  fireEvent.click(screen.getByText('Get Images'))//analyze words
  

  await waitFor(() => screen.getByRole('img'))

  expect(screen.getByRole('img').getAttribute('src')).toBe('https://ichef.bbci.co.uk/food/ic/food_16x9_320/foods/p/pumpkin_16x9.jpg')
})

/*
{
  value: [
    {
      url: 'https://ichef.bbci.co.uk/food/ic/food_16x9_320/foods/p/pumpkin_16x9.jpg'
    }
  ]
}
*/