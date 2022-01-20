import React from 'react'
import { Highlight, HighlightWrapper, SSearchHighlights, TitleHighlightWrapper } from '../../../style/Search'

// Split text string where pos [startIndex, len]
const textHighlightSplit = (pos: [number, number], text: string, startPadding = 15, endPadding = 80) => {
  // Slicing indices: preStart start end postEnd
  const start = pos[0]
  const end = pos[0] + pos[1]
  const preStart = start - startPadding < 0 ? 0 : start - startPadding
  const postEnd = end + endPadding < text.length ? end + endPadding : text.length
  // Slices
  return {
    preMatch: text.slice(preStart, start),
    match: text.slice(start, end),
    postMatch: text.slice(end, postEnd)
  }
}

const positionsToSplit = (pos: [number, number][], text: string) => {
  const titleHighlights: TitleHighlight[] = []
  // We are slicing the same text multiple times
  // and marking the matches as highlighted
  let processedLength = 0
  pos.forEach((p) => {
    // Slicing Indices
    const start = processedLength + p[0]
    const end = start + p[1]
    processedLength = end
    // Slices
    titleHighlights.push({
      text: text.slice(processedLength, start),
      highlighted: false
    })
    titleHighlights.push({
      text: text.slice(start, end),
      highlighted: true
    })
  })
  if (processedLength < text.length) {
    // End slice, if left
    titleHighlights.push({
      text: text.slice(processedLength),
      highlighted: false
    })
  }
  return titleHighlights
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const highlightText = (metadata: any, content: string, title: string) => {
  if (content === undefined) return []
  if (metadata === undefined) return []

  let collectedTitleHighlights: TitleHighlight[] = []

  // All matches are either in title or text or both
  const totalMatches = Object.keys(metadata).reduce((prev, k) => {
    let newVal = prev
    if (metadata[k].text) newVal += metadata[k].text.position.length
    if (metadata[k].title) newVal += metadata[k].title.position.length
    return newVal
  }, 0)

  const highlights = Object.keys(metadata).reduce((prev, k) => {
    const match = metadata[k]

    const textHighlights =
      match.text &&
      match.text.position.map((pos: [number, number]) => {
        return textHighlightSplit(pos, content)
      })

    // Title matches are in match.title
    if (match.title !== undefined) {
      // Split in the same string, with matched text highlighted
      // Could be several times in the title
      const titleHighlights = positionsToSplit(match.title.position, title)
      collectedTitleHighlights = collectedTitleHighlights.concat(titleHighlights)
    }

    // merge if any text highlight in match
    return textHighlights !== undefined
      ? {
          ...prev,
          [k]: { text: textHighlights }
        }
      : prev
  }, {})

  const highlightsCorrected = Object.keys(highlights).length === 0 ? undefined : highlights

  return {
    totalMatches,
    highlights: highlightsCorrected, // text highlights - separate sliced
    titleHighlights: collectedTitleHighlights // title highlights - sliced together
  }
}

export interface TitleHighlight {
  text: string
  highlighted: boolean
}
export interface TitleHighlightsProps {
  titleHighlights: TitleHighlight[]
}

export const TitleHighlights = ({ titleHighlights }: TitleHighlightsProps) => (
  <TitleHighlightWrapper>
    {titleHighlights.map((k, i) => {
      return k.highlighted ? <Highlight key={`search_highlight_${k}${i}`}>{k.text}</Highlight> : <>{k.text}</>
    })}
  </TitleHighlightWrapper>
)

export interface SearchHighlight {
  preMatch: string
  match: string
  postMatch: string
}

export interface SearchHighlightsProps {
  highlights: {
    [key: string]: {
      text: SearchHighlight[]
    }
  }
}

export const SearchHighlights = ({ highlights }: SearchHighlightsProps) => (
  <SSearchHighlights>
    {Object.keys(highlights).map((k, i) => {
      return highlights[k].text.map((h, j) => {
        // console.log(k, h)
        return (
          <HighlightWrapper key={`search_highlight_${h.match}${j}${i}`}>
            ...{h.preMatch}
            <Highlight>{h.match}</Highlight>
            {h.postMatch}
          </HighlightWrapper>
        )
      })
    })}
  </SSearchHighlights>
)
