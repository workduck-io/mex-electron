import {
  ToolbarLinkProps,
  useStoreEditorState,
  useEventEditorId,
  getPlatePluginType,
  ELEMENT_LINK,
  someNode,
  getAbove,
  unwrapNodes,
  isCollapsed,
  upsertLinkAtSelection
} from '@udecode/plate'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { HeadlessButton } from '../../../Styled/Buttons'
import styled from 'styled-components'
import { Input } from '../../../Styled/Form'
import { clearBlurSelection } from '../../Plugins/blurSelection'

const LinkButtonStyled = styled.div`
  user-select: all;
  form {
    display: flex;
    align-items: center;
    ${HeadlessButton} {
      color: inherit;
    }
    input {
      background: ${({ theme }) => theme.colors.gray[9]};
      border: 1px solid ${({ theme }) => theme.colors.gray[7]};
      color: ${({ theme }) => theme.colors.text.subheading};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
  }
`

interface LinkButtonProps extends ToolbarLinkProps {
  setSelected: (selected: boolean) => void
}

const LinkButton = ({ getLinkUrl, setSelected, ...props }: LinkButtonProps) => {
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

    // setInp({ prev: '' })
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
        <Input defaultValue={inp.prev} type="text" {...register('link-input')} />
      </form>
    </LinkButtonStyled>
  )
}

export default LinkButton
