import React, { useEffect } from 'react'
import { useSpring } from 'react-spring'
import { Input } from '../../../../style/Form'
import { useActionStore } from '../../Actions/useActionStore'
import MenuItem from './MenuItem'
import { StyledActionMenu, StyledMenuItems } from './styled'
import tinykeys from 'tinykeys'

type MenuProps = {}

const Menu: React.FC<MenuProps> = () => {
  const getConfig = useActionStore((store) => store.getConfig)
  const activeAction = useActionStore((store) => store.activeAction)
  const menuItems = getConfig(activeAction?.actionGroupId, activeAction?.id)?.postAction?.menus

  const transitions = useSpring({
    from: {
      width: '0'
    },
    to: {
      width: '36vw'
    }
  })

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        event.stopPropagation()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])
  return (
    <StyledActionMenu style={transitions} id="wd-mex-action-menu">
      <div id="wd-mex-action-menu-heading">#43</div>
      <StyledMenuItems id="wd-mex-action-menu-content">
        {menuItems?.map((item) => {
          return (
            <MenuItem
              key={item.actionId}
              item={item}
              title={getConfig(activeAction?.actionGroupId, item.actionId).name}
            />
          )
        })}
      </StyledMenuItems>
      <Input autoFocus type="text" id="wd-mex-action-menu-search" placeholder="Search" />
    </StyledActionMenu>
  )
}

export default Menu
