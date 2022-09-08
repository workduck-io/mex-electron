import { useTags } from '@hooks/useTags'
import hashtag from '@iconify/icons-ri/hashtag'
import { SidebarHeaderLite } from '@ui/sidebar/Sidebar.space.header'
import { SidebarWrapper } from '@ui/sidebar/Sidebar.style'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import SidebarList from './SidebarList'

const TagList = () => {
  const { getAllTags } = useTags()
  // const { tag } = useParams<{ tag: string }>()
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)
  // const [tags, setTags] = useState(Object.keys(cleanCache))
  const tags = getAllTags().map((t) => ({
    id: t,
    label: t,
    icon: hashtag,
    data: t
  }))

  const tag = isTagsView && isTagsView.params?.tag

  const { goTo } = useRouting()

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  mog('Tags', { tags, isTagsView, tag })

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title="Tags" icon={hashtag} />

      <SidebarList
        showSearch
        searchPlaceholder="Filter tags..."
        emptyMessage="No tags found"
        items={tags}
        selectedItemId={tag}
        onClick={navigateToTag}
      />
    </SidebarWrapper>
  )
}

export default TagList
