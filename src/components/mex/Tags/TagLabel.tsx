import { Tag } from '../../../types/Types'
import React from 'react'
import { TagFlex, TagsFlex } from './TagsRelated.styles'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { useSpotlightContext } from '@store/Context/context.spotlight'

const TagLabel = ({ tag }: { tag: Tag }) => {
  const { goTo } = useRouting()
  const isSpotlight = useSpotlightContext()

  const navigateToTag = (tag: string) => {
    if (isSpotlight) return
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <TagFlex
      onClick={(e) => {
        e.preventDefault()
        navigateToTag(tag.value)
      }}
    >
      #{tag.value}
    </TagFlex>
  )
}

export const TagsLabel = ({ tags }: { tags: Tag[] }) => {
  return (
    <TagsFlex>
      {tags.map((tag) => (
        <TagLabel key={`Tags_Label_${tag.value}`} tag={tag} />
      ))}
    </TagsFlex>
  )
}

export default TagLabel
