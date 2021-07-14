import { ImageGrid } from '..'
import { render, screen } from '@testing-library/react'
import {setupServer} from 'msw/node'

const wordImagesList = new Array<WordImages>(3)
for (let i = 0; i < wordImagesList.length; i++) {
  const wordImages = {
    word: {name: `word${i}`},
    images: {
      urls: [], //urls not tested
      bytes: 
    }
  }
  for (let j = 0; j < wordImage.urls.length; j++) {
    wordImage.urls[j] = fetch(`fake`)
  }

  imgUrls[i] = wordImage
}

/*
test.each(imgUrls)('hasUrl%#', url => {
  const {container} = render(<ImageGrid imgUrls={imgUrls} />)

  expect(container.querySelector(`img[src="${url}"]`)).toBeTruthy
})

test('displays correct number of images', () => {
  render(<ImageGrid imgUrls={imgUrls} />)

  const images = screen.getAllByRole('img')

  expect(images).toHaveLength(imgUrls.length)
})

test('shuffles images', () => {//this test may incorrectly fail, although it is unlikely. Run multiple times to improve confidence
  const {rerender, container} = render(<ImageGrid imgUrls={imgUrls} />)

  const img1 = container.querySelector('img')?.getAttribute('src') as string //get src of the img at the top of the dom list

  rerender(<ImageGrid imgUrls={imgUrls} />)

  const img2 = container.querySelector('img')?.getAttribute('src') as string //src of top img on second render

  expect(img1).not.toBe(img2)
})*/