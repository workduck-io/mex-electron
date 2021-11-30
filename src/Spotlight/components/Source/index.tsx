/* eslint-disable react/prop-types */
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const getHtmlString = (metadata: any) => {
  return ReactDOMServer.renderToStaticMarkup(<Source metadata={metadata} />)
}

const Source: React.FC<{ metadata: any }> = ({ metadata }) => {
  // console.log({ metadata })
  if (!metadata) {
    return null
  }

  if (metadata?.url) {
    return (
      <>
        <br />
        <br />
        <strong>Source: </strong>
        <a href={metadata.url} target="_blank" rel="noopener noreferrer">
          {metadata?.title}
        </a>
        {/* <AppName>{metadata?.owner?.name}</AppName> */}
      </>
    )
  }

  return (
    <>
      <br />
      <br />
      <strong>Source: </strong>
      <a href="#">{`${metadata?.title} ( ${metadata?.owner?.name} )`}</a>
    </>
  )
}

export default Source
