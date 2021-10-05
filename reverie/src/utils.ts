//set up Rekognition
import {
  RekognitionClient,
  DetectLabelsCommand,
} from '@aws-sdk/client-rekognition'
const client = new RekognitionClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
})

/**
 * Fetches urls of images for each word to be processed later.
 *
 * @param words Array of words to fetch urls for
 * @returns A promise for an array of url arrays, one for each word
 */
export const fetchUrlLists = async (words: Word[]) => {
  //for each word, fetch a list of image urls and store it in an array (urlLists)
  const urlLists = words.map(async word => {
    try {
      const url =
        `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?` +
        new URLSearchParams([
          ['q', word.name],
          ['pageNumber', 1],
          ['pageSize', 50],
          ['autoCorrect', false],
          ['safeSearch', true],
        ] as string[][]).toString()

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST!,
        },
      })
      const data = (await res.json()) as {
        value: { url: string; title: string }[]
      }

      const acceptedFormats = [
        '.png',
        '.jpg',
        '.jpeg',
        '.jfif',
        '.pjpeg',
        '.pjp',
      ]

      //Filter out urls either not hosted on https or not
      //containing an image of a valid format for Rekognition
      const goodResults = data.value.flatMap(result => {
        const isCorrectFormat = acceptedFormats.some(format =>
          result.url.includes(format)
        )

        return url.startsWith('https') && isCorrectFormat
          ? [{ url: result.url, title: result.title }]
          : []
      })

      const wordImages = {
        word: word,
        images: goodResults.map(result => ({
          url: result.url,
          title: result.title,
        })),
      } as WordImages

      return wordImages
    } catch (error) {
      return error
    }
  })

  return await Promise.all(urlLists)
}

/**
 * Converts each url in a list of image-url-arrays to bytes (Uint8Arrays). This
 * prepares the images to be processed by Amazon Rekognition.
 *
 * @param urlLists The result from fetchUrlLists(): a promise for an array of url arrays
 * @returns A promise of bytes in the same shape as the input.
 */
export const imagesToBytes = async (wordImagesList: WordImages[]) => {
  const updatedWordImages = wordImagesList.map(async wordImages => {
    const imageBytes = wordImages.images.map(async image => {
      try {
        //Originally, requests on some images were taking too long.
        //This abort controller is to set a timeout on fetching.
        const controller = new AbortController()
        const signal = controller.signal

        setTimeout(() => controller.abort(), 2000)
        const res = await fetch(image.url, { signal })

        const bytes = await res.arrayBuffer()
        const ua = new Uint8Array(bytes)

        return ua
      } catch (error) {
        console.log('error fetching image')
        return null
      }
    })
    const resolvedImageBytes = await Promise.all(imageBytes)

    //If bytes exist for an image, append it
    resolvedImageBytes.forEach((bytes, index) => {
      if (bytes) wordImages.images[index].bytes = bytes
    })

    //Remove all image objects not containing bytes
    wordImages.images = wordImages.images.filter(image => image.bytes)

    return wordImages
  })

  return await Promise.all(updatedWordImages)
}

/**Passes images to Rekognition for label detection. A label is
 * something Rekognition sees in an image: e.g., a person or a window.
 * Then modifies the input WordImages[] in place to add labels data to each image object,
 * and an allLabels property to each WordImages object.
 *
 * @param imageBytesLists A WordImages[] with image bytes data to analyze
 * @returns The modified WordImages array
 */
export const analyzeImages = async (wordImagesList: WordImages[]) => {
  const updatedWordImagesList = wordImagesList.map(async wordImages => {
    //Process each wordImages

    const WordImagesLabels = wordImages.images.map(async image => {
      try {
        //call Rekognition for labels
        const rekognitionCommand = new DetectLabelsCommand({
          Image: { Bytes: image.bytes },
        })
        const rekognitionResponse = await client.send(rekognitionCommand)
        const imageLabels = rekognitionResponse.Labels?.flatMap(label =>
          label.Name ? [label.Name] : []
        )

        return imageLabels
      } catch (error) {
        console.log('error analyzing image', error)
        return
      }
    })
    const resolvedImagesLabelList = await Promise.all(WordImagesLabels)

    //modify wordImages in place to append labels to each image if they exist,
    //and append an objectUrl to be displayed later since this was a successfully
    //analyzed image
    resolvedImagesLabelList.forEach((labelList, index) => {
      const currentImage = wordImages.images[index]

      if (labelList) {
        currentImage.labels = labelList
        currentImage.bytesUrl = URL.createObjectURL(
          new Blob([currentImage.bytes!.buffer])
        )
      }
    })

    //Filter out all images without bytesUrls
    wordImages.images = wordImages.images.filter(image => image.bytesUrl)

    //make a set for each word of all its labels and add it to wordImages's allLabels property
    const wordLabelsSet = new Set<string>()

    wordImages.images.forEach(image =>
      image.labels!.forEach(label => wordLabelsSet.add(label))
    )
    wordImages.allLabels = [...wordLabelsSet]

    return wordImages
  })

  return await Promise.all(updatedWordImagesList)
}

/**
 * Extracts labels from a WordImages[] to find labels shared between all words.
 * Sorts these labels by most to least shared and returns them in Association objects.
 *
 * @param wordImagesList An array of WordImages to pull labels from and sort
 * @param labelsToReturn The number of common labels (labels shared between words) to return
 * @returns An array of Association objects (containing labels and their occurrences between words)
 */

export const sortLabels = (
  wordImagesList: WordImages[],
  labelsToReturn: number = 50
) => {
  //count how many words a label appears across
  const countedLabels = new Map<string, number>()

  wordImagesList.forEach(wordImages => {
    wordImages.allLabels?.forEach(label => {
      //initializes count to 1 if not counted yet, or adds to count
      const labelCount = countedLabels.has(label)
        ? countedLabels.get(label)! + 1
        : 1
      countedLabels.set(label, labelCount)
    })
  })

  //sort common labels by occurrences: greatest first
  const sortedLabels = [...countedLabels.entries()].sort((a, b) => b[1] - a[1])

  //return labelsToReturn labels or all labels if there are fewer than labelsToReturn
  const returnLength =
    sortedLabels.length >= labelsToReturn ? labelsToReturn : sortedLabels.length

  const trimmedLabels = sortedLabels.slice(0, returnLength)

  return trimmedLabels.map(label => ({
    name: label[0],
    occurrences: label[1],
  })) as Association[]
}

/**
 * Shuffles an array in place and returns it.
 * Taken from Richard Durstenfield's implementation of the Fisher-Yates shuffle:
 * https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
 *
 * @param array The array to be shuffled
 */
export const shuffle = (array: any[]) => {
  let currentIndex = array.length
  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--)
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}
