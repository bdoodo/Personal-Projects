import { setupWorker, rest } from "msw"

export const worker = setupWorker(
  rest.get('/testGoogleImageApi', (req, res, ctx) => {
    const pageSize = Number.parseInt(req.url.searchParams.get('pageSize')!)

    const value = new Array<{url: string}>()

    for (let i = 0; i < pageSize; i++) {
      value.push({url: 'https://ichef.bbci.co.uk/food/ic/food_16x9_320/foods/p/pumpkin_16x9.jpg'})
    }

    return res(
      ctx.status(200),
      ctx.json({value: value})
    )
  })
)