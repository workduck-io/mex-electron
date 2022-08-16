import useLoad from '@hooks/useLoad'
import { useKeyListener } from '@hooks/useShortcutListener'
import useBlockStore from '@store/useBlockStore'
import { useEditorStore } from '@store/useEditorStore'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useEffect } from 'react'
import { tinykeys } from '@workduck-io/tinykeys'

export const useNavigator = () => {
  /** Set shortcuts */
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const node = useEditorStore((store) => store.node)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const toggleFocusMode = useLayoutStore((s) => s.toggleFocusMode)

  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  useEffect(() => {
    if (focusMode.on) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          shortcutHandler({ disabled: false, title: 'Block View', keystrokes: 'Escape', category: 'Actions' }, () => {
            toggleFocusMode()
          })
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [focusMode]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isBlockMode) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          shortcutHandler({ disabled: false, title: 'Block View', keystrokes: 'Escape', category: 'Actions' }, () => {
            setIsBlockMode(false)
          })
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [isBlockMode])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showSnippets.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSnippets, () => {
          goTo(ROUTE_PATHS.snippets, NavigationType.push)
        })
      },
      [shortcuts.showIntegrations.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showIntegrations, () => {
          // onSave(undefined, false, false)
          goTo(ROUTE_PATHS.integrations, NavigationType.push)
        })
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          loadNode(node.nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
        })
      },
      [shortcuts.showTasks.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          goTo(ROUTE_PATHS.tasks, NavigationType.push)
        })
      },
      [shortcuts.showArchive.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showArchive, () => {
          goTo(ROUTE_PATHS.archive, NavigationType.push)
        })
      },
      [shortcuts.showSearch.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSearch, () => {
          // onSave(undefined, false, false)
          goTo(ROUTE_PATHS.search, NavigationType.push)
        })
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSettings, () => {
          // onSave(undefined, false, false)
          goTo(`${ROUTE_PATHS.settings}/user`, NavigationType.push)
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, node.nodeid]) // eslint-disable-line react-hooks/exhaustive-deps
}
