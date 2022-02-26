/* eslint-disable react/prop-types */
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const getHtmlString = (metadata: any) => {
  return ReactDOMServer.renderToStaticMarkup(<Source metadata={metadata} />)
}

const Source: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata) {
    return null
  }

  if (metadata?.url) {
    return (
      <>
        {'  ['}
        <a href={metadata.url} target="_blank" rel="noopener noreferrer">
          Ref
        </a>
        {' ]'}
      </>
    )
  }

  return <></>
}

export default Source
