/* src/App.js */
import { useState } from 'react'
import { ImageGrid, WordList, Associations } from './components'
import {
  analyzeImages,
  fetchUrlLists,
  imagesToBytes,
  sortLabels,
} from './utils'

export const App = () => {
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [activeWords, setActiveWords] = useState(new Array<Word>())
  const [processing, setProcessing] = useState(false)
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

  const getAssociations = async () => {
    setProcessing(true)

    const imgUrlLists = await fetchUrlLists(activeWords)
    console.log('after urls:', imgUrlLists)
    const imgBytesLists = await imagesToBytes(imgUrlLists)
    console.log('after bytes:', imgBytesLists)
    const labels = await analyzeImages(imgBytesLists)
    console.log('after labels:', labels)
    setWordImages(labels)

    const sortedLabels = sortLabels(labels, 10)

    setAssociations(sortedLabels)
    setProcessing(false)
  }

  const filtersState = { filters: filters, setFilters: setFilters }

  return (
    <div>
      <WordList setActiveWords={setActiveWords} filtersState={filtersState} />
      <button onClick={getAssociations}>Get images</button>
      <Associations
        associationList={associations}
        processing={processing}
        filtersState={filtersState}
        wordImagesList={wordImages}
      />
      <ImageGrid
        wordImagesList={wordImages}
        processing={processing}
        filters={filters}
      />
    </div>
  )
}
