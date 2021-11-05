import React from 'react'
import { Highlight, HighlightWrapper, SSearchHighlights, TitleHighlightWrapper } from '../../Styled/Search'

const positionToSplit = (pos: [number, number], text: string, startCut = 15, endCut = 80) => {
  const start = pos[0]
  const end = pos[0] + pos[1]
  const preStart = start - startCut < 0 ? 0 : start - startCut
  const postEnd = end + endCut < text.length ? end + endCut : text.length
  // console.log({
  //   start,
  //   end,
  //   preStart,
  //   postEnd,
  //   preMatch: text.slice(preStart, start),
  //   match: text.slice(start, end),
  //   postMatch: text.slice(end, postEnd)
  // })
  return {
    preMatch: text.slice(preStart, start),
    match: text.slice(start, end),
    postMatch: text.slice(end, postEnd)
  }
}

const positionsToSplit = (pos: [number, number][], text: string) => {
  const titleHighlights: TitleHighlight[] = []
  let processedLength = 0
  pos.forEach((p) => {
    const start = processedLength + p[0]
    const end = start + p[1]
    processedLength = end
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

  const totalMatches = Object.keys(metadata).reduce((prev, k) => {
    // console.log(prev, metadata, metadata[k])
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
        return positionToSplit(pos, content)
      })

    if (match.title !== undefined) {
      const titleHighlights = positionsToSplit(match.title.position, title)
      collectedTitleHighlights = collectedTitleHighlights.concat(titleHighlights)
    }

    return textHighlights !== undefined
      ? {
          ...prev,
          [k]: { text: textHighlights }
        }
      : prev
  }, {})

  const highlightsCorrected = Object.keys(highlights).length === 0 ? undefined : highlights

  console.log({ highlightsCorrected })

  return {
    highlights: highlightsCorrected,
    totalMatches,
    titleHighlights: collectedTitleHighlights
  }
}

export interface SearchHighlight {
  preMatch: string
  match: string
  postMatch: string
}

export interface TitleHighlight {
  text: string
  highlighted: boolean
}

export interface SearchHighlightsProps {
  highlights: {
    [key: string]: {
      text: SearchHighlight[]
    }
  }
}

export interface TitleHighlightsProps {
  titleHighlights: TitleHighlight[]
}

export const TitleHighlights = ({ titleHighlights }: TitleHighlightsProps) => {
  // console.log(highlights)
  return (
    <TitleHighlightWrapper>
      {titleHighlights.map((k, i) => {
        return k.highlighted ? <Highlight key={`search_highlight_${k}${i}`}>{k.text}</Highlight> : <>{k.text}</>
      })}
    </TitleHighlightWrapper>
  )
}

export const SearchHighlights = ({ highlights }: SearchHighlightsProps) => {
  // console.log(highlights)
  return (
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
}
