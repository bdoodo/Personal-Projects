const fetch = require('node-fetch')

exports.handler = async (event) => {
    const urlList = JSON.parse(event.body)

    if (!Array.isArray(urlList)) return {
        statuscode: 400,
        body: JSON.stringify('invalid request format')
    }

    let uInt8ArrayBytes = urlList.map(async url => {
        try {
          const res = await fetch(url)
          const imageBytes = await res.arrayBuffer()
          const ua = new Uint8Array(imageBytes)

          return ua
        } catch (error) {
          console.log('error fetching image', error)
          return null
        }
    })
    
    const result = await Promise.all(uInt8ArrayBytes)

    const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify(result),
    };
    return response;
}