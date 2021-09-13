import boldIcon from '@iconify-icons/ri/bold'
import doubleQuotesL from '@iconify-icons/ri/double-quotes-l'
import h1 from '@iconify-icons/ri/h-1'
import h2 from '@iconify-icons/ri/h-2'
import h3 from '@iconify-icons/ri/h-3'
import italicIcon from '@iconify-icons/ri/italic'
import listOrdered from '@iconify-icons/ri/list-ordered'
import listUnordered from '@iconify-icons/ri/list-unordered'
import underlineIcon from '@iconify-icons/ri/underline'
import { Icon } from '@iconify/react'
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LINK,
  ELEMENT_OL,
  ELEMENT_UL,
  getAbove,
  getPlatePluginType,
  isCollapsed,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  someNode,
  ToolbarButtonProps,
  unwrapNodes,
  upsertLinkAtSelection,
  useEventEditorId,
  useStoreEditorRef,
  useStoreEditorState
} from '@udecode/plate'
import { transparentize } from 'polished'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import styled, { css } from 'styled-components'
import { HeadlessButton } from '../../Styled/Buttons'
import { BToolbar, TElement, TList, TMark } from '../../Styled/Toolbar'

const LinkButtonStyled = styled.div`
  user-select: all;
  form {
    display: flex;
    align-items: center;
    ${HeadlessButton} {
      color: inherit;
    }
    input {
      background: ${({ theme }) => theme.colors.background.card};
      border: 1px solid ${({ theme }) => theme.colors.gray[3]};
      color: ${({ theme }) => theme.colors.text.subheading};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
  }
`

interface LinkButtonProps extends ToolbarLinkProps {
  setSelected: (selected: boolean) => void
}

export const LinkButton = ({ getLinkUrl, setSelected, ...props }: LinkButtonProps) => {
  const editor = useStoreEditorState(useEventEditorId('focus'))

  const type = getPlatePluginType(editor, ELEMENT_LINK)
  const isLink = !!editor?.selection && someNode(editor, { match: { type } })
  const [inp, setInp] = useState({
    prev: ''
  })

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
    getValues
  } = useForm()

  useEffect(() => {
    setSelected(true)
    return () => {
      setSelected(false)
    }
  })

  useEffect(() => {
    if (!editor) return
    const linkNode = getAbove(editor, {
      match: { type }
    })
    if (inp.prev === '' && linkNode) {
      setInp({
        prev: linkNode[0].url as string
      })
    }
  }, [editor, inp.prev, type])

  const onSubmitLink = async () => {
    if (!editor) return

    // Blur focus returns
    if (!editor || ReactEditor.isFocused(editor)) return
    try {
      ReactEditor.focus(editor)
      if (!editor.selection && editor.blurSelection) {
        Transforms.select(editor, editor.blurSelection)
      }
    } catch (err) {
      console.error(err) // eslint-disable-line no-console
    }

    const linkNode = getAbove(editor, {
      match: { type }
    })
    if (linkNode) {
      setInp({
        prev: linkNode[0].url as string
      })
    }
    // console.log(inp);

    let url = ''
    if (getLinkUrl) {
      const tempUrl = await getLinkUrl(inp.prev)
      if (tempUrl) {
        url = tempUrl
      }
    } else {
      // Get url from user
      const val = getValues()
      // console.log({ val });

      if (val['link-input']) url = val['link-input']
    }

    if (inp.prev) {
      if (linkNode && editor.selection) {
        unwrapNodes(editor, {
          at: editor.selection,
          match: { type: getPlatePluginType(editor, ELEMENT_LINK) }
        })
      }

      return
    }

    // If our cursor is in middle of a link, then we don't want to inser it inline
    const shouldWrap: boolean = linkNode !== undefined && isCollapsed(editor.selection)
    upsertLinkAtSelection(editor, { url, wrap: shouldWrap })

    setSelected(false)
  }

  const onSubmit = async (data: any) => {
    console.log(data) // eslint-disable-line no-console
    await onSubmitLink()
  }

  const { icon } = props

  return (
    <LinkButtonStyled className="button_of_link">
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeadlessButton
          active={isLink.toString()}
          as={undefined as any}
          // onMouseDown={handleMouseDownLink}
          type="submit"
          // tooltip={{ interactive: true }}
          {...props}
        >
          {icon}
        </HeadlessButton>
        <input defaultValue={inp.prev} type="text" {...register('link-input')} />
      </form>
    </LinkButtonStyled>
  )
}

export const TippyBalloonStyles = css`
  .tippy-box[data-theme~='mex'] {
    background-color: ${({ theme }) => theme.colors.gray[7]};
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: ${({ theme }) => theme.colors.gray[7]};
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: ${({ theme }) => theme.colors.gray[7]};
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: ${({ theme }) => theme.colors.gray[7]};
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: ${({ theme }) => theme.colors.gray[7]};
    }

    > .tippy-backdrop {
      background-color: ${({ theme }) => theme.colors.gray[7]};
    }

    > .tippy-svg-arrow {
      fill: ${({ theme }) => theme.colors.gray[7]};
    }
  }

  body .slate-BalloonToolbar {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
    box-shadow: 0px 3px 9px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
    &::after {
      border-color: ${({ theme }) => theme.colors.gray[8]} transparent;
    }
    .slate-ToolbarButton {
      color: ${({ theme }) => theme.colors.text.default};
      padding: ${({ theme: { spacing } }) => `${spacing.tiny}`};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
    .slate-ToolbarButton-active,
    .slate-ToolbarButton:hover {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.gray[9]};
    }
  }
`

const ButtonSeparator = styled.div`
  height: 10px;
  margin: 0 ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
`

const BallonToolbarMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'))
  const [selected, setSelected] = useState(false)

  const arrow = true
  const direction = 'top'
  const hiddenDelay = 0
  const tooltip = {
    arrow: true,
    delay: 0,
    theme: 'mex',
    duration: [200, 0] as [number, number],
    // hideOnClick: false,
    offset: [0, 17] as [number, number],
    placement: 'top' as const
  }

  return (
    <BToolbar
      direction={direction}
      hiddenDelay={hiddenDelay}
      // theme={theme}
      arrow={arrow}
      // selected={selected}
    >
      <TElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon height={20} icon={h1} />}
        tooltip={{ content: 'Heading 1', ...tooltip }}
      />

      <TElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon height={20} icon={h2} />}
        tooltip={{ content: 'Heading 2', ...tooltip }}
      />

      <TElement
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<Icon height={20} icon={h3} />}
        tooltip={{ content: 'Heading 3', ...tooltip }}
      />

      <ButtonSeparator />

      <TElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon height={20} icon={doubleQuotesL} />}
        tooltip={{ content: 'Quote', ...tooltip }}
      />

      <TList
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon height={20} icon={listUnordered} />}
        tooltip={{ content: 'Bullet List', ...tooltip }}
      />

      <TList
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<Icon height={20} icon={listOrdered} />}
        tooltip={{ content: 'Ordered List', ...tooltip }}
      />

      <ButtonSeparator />

      <TMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <TMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <TMark
        type={getPlatePluginType(editor, MARK_UNDERLINE)}
        icon={<Icon height={20} icon={underlineIcon} />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
    </BToolbar>
  )
}

export interface ToolbarLinkProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the link url by calling this promise before inserting the image.
   */
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>
}

export default BallonToolbarMarks
