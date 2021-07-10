const fetch = require('node-fetch')

exports.handler = async (event) => {
    const uInt8ArrayBytesList = event.body.map(async urlList => {
      const uInt8ArrayBytes = urlList.map(async url => {
        const res = await fetch(url)
        const imageBytes = await res.arrayBuffer()
        const ua = new Uint8Array(imageBytes)

        return ua
      })

      return await Promise.all(uInt8ArrayBytes)
    })

    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: await uInt8ArrayBytesList,
    };
    return response;
};
