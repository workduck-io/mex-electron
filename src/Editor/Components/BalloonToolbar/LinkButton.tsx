import Tippy, { TippyProps } from '@tippyjs/react' // optional
import {
  ELEMENT_LINK,
  getAbove,
  getPlatePluginType,
  isCollapsed,
  LinkToolbarButtonProps,
  someNode,
  unwrapNodes,
  upsertLinkAtSelection,
  usePlateEditorState,
  usePlateEventId
} from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import styled from 'styled-components'
import { HeadlessButton } from '../../../Styled/Buttons'
import { Input } from '../../../Styled/Form'
import { clearBlurSelection } from '../../Plugins/blurSelection'

const LinkButtonStyled = styled.div`
  user-select: all;
  form {
    display: flex;
    align-items: center;
    ${HeadlessButton} {
      color: inherit;
      color: ${({ theme }) => theme.colors.text.default};
      padding: ${({ theme: { spacing } }) => `${spacing.tiny}`};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      margin-right: ${({ theme }) => theme.spacing.tiny};
      &:hover {
        color: ${({ theme }) => theme.colors.primary};
        background-color: ${({ theme }) => theme.colors.gray[9]};
      }
    }
    input {
      background: ${({ theme }) => theme.colors.gray[9]};
      color: ${({ theme }) => theme.colors.text.subheading};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      border: 1px solid transparent;
    }
  }
  input::placeholder {
    color: ${({ theme }) => theme.colors.text.fade};
    opacity: 0.5;
  }
`

type LinkButtonProps = LinkToolbarButtonProps

const LinkButton = ({ getLinkUrl, ...props }: LinkButtonProps) => {
  const editor = usePlateEditorState(usePlateEventId('focus'))

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
    getValues,
    reset
  } = useForm()

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
      if (!editor.selection && editor.prevSelection) {
        Transforms.select(editor, editor.prevSelection)
      }
    } catch (err) {
      console.error(err) // eslint-disable-line no-console
    }

    clearBlurSelection(editor as any)

    const linkNode = getAbove(editor, {
      match: { type }
    })
    if (linkNode) {
      setInp({
        prev: linkNode[0].url as string
      })
    }

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

    setInp({ prev: '' })
    reset()
  }

  const onSubmit = async (data: any) => {
    // console.log(data)
    await onSubmitLink()
  }

  const { icon, tooltip } = props

  const tooltipProps: TippyProps = {
    content: '',
    arrow: true,
    offset: [0, 17],
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    ...tooltip
  }

  const linkInput = (
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
        <Input placeholder="Paste link here..." defaultValue={inp.prev} type="text" {...register('link-input')} />
      </form>
    </LinkButtonStyled>
  )

  return tooltip ? <Tippy {...tooltipProps}>{linkInput}</Tippy> : linkInput
}

export default LinkButton
