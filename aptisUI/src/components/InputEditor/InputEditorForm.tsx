import { Lock, LockOpen, TextFields } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import type { EditorOptions } from '@tiptap/core'
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef
} from 'mui-tiptap'
import { useCallback, useEffect, useRef, useState } from 'react'
import EditorMenuControls from './EditorMenuControls'
import useExtensions from './useExtensions'

import './styles.css'

function fileListToImageFiles(fileList: FileList): File[] {
  // You may want to use a package like attr-accept
  // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
  // types.
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || '').toLowerCase()
    return mimeType.startsWith('image/')
  })
}

export default function InputEditorForm({
  content,
  updateNoteSpeak,
  isShowFoter = true,
  hieghtInput = null,
  labelInput = null,

  onChange
}: {
  content: string
  onScaleSreen?: () => void
  updateNoteSpeak?: (value: any) => void
  isShowFoter?: boolean
  hieghtInput?: number | string | null
  labelInput?: string | null
  onChange?: any
}) {
  useEffect(() => {
    if (rteRef.current?.editor) {
      rteRef.current.editor.commands.setContent(content) // Cập nhật nội dung
      const editorElement = rteRef.current.editor.view.dom
      editorElement.style.minHeight = 'calc(100vh - 500px)' // Ví dụ đặt chiều cao tối thiểu
      editorElement.style.height = 'auto'
    }
  }, [content])

  const extensions = useExtensions({
    placeholder: 'Add your own content here...'
  })
  const rteRef = useRef<RichTextEditorRef>(null)
  const [isEditable, setIsEditable] = useState(true)
  const [showMenuBar, setShowMenuBar] = useState(true)

  const handleNewImageFiles = useCallback((files: File[], insertPosition?: number): void => {
    if (!rteRef.current?.editor) {
      return
    }

    const attributesForImageFiles = files.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name
    }))

    insertImages({
      images: attributesForImageFiles,
      editor: rteRef.current.editor,
      position: insertPosition
    })
  }, [])

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> = useCallback(
    (view, event, _slice, _moved) => {
      if (!(event instanceof DragEvent) || !event.dataTransfer) {
        return false
      }

      const imageFiles = fileListToImageFiles(event.dataTransfer.files)
      if (imageFiles.length > 0) {
        const insertPosition = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        })?.pos

        handleNewImageFiles(imageFiles, insertPosition)

        // Return true to treat the event as handled. We call preventDefault
        // ourselves for good measure.
        event.preventDefault()
        return true
      }

      return false
    },
    [handleNewImageFiles]
  )

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions['editorProps']['handlePaste']> = useCallback(
    (_view, event, _slice) => {
      if (!event.clipboardData) {
        return false
      }

      const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
      if (pastedImageFiles.length > 0) {
        handleNewImageFiles(pastedImageFiles)

        return true
      }

      // We return false here to allow the standard paste-handler to run.
      return false
    },
    [handleNewImageFiles]
  )

  const [submittedContent, setSubmittedContent] = useState('')

  const handleSubmit = () => {
    const contentUpdate = rteRef.current?.editor?.getHTML()
    if (contentUpdate) {
      updateNoteSpeak?.(contentUpdate)
    }
  }

  return (
    <>
      {labelInput && <label>{labelInput}</label>}
      <Box
        sx={{
          '& .ProseMirror': {
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              scrollMarginTop: showMenuBar ? 50 : 0
            }
          },
          height: hieghtInput ? hieghtInput : '100%',
          background: 'rgba(0, 0, 0, 0.04)',
          position: 'relative'
        }}
      >
        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          content={content}
          editable={isEditable}
          editorProps={{
            handleDrop: handleDrop,
            handlePaste: handlePaste
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML())
          }}
          renderControls={() => <EditorMenuControls />}
          RichTextFieldProps={{
            variant: 'outlined',
            MenuBarProps: {
              hide: !showMenuBar
            },

            className: `rich-text-box bg-[#4b4b4be0] text-white`,

            footer: isShowFoter && (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  borderTopStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: (theme) => theme.palette.divider,
                  py: 1,
                  px: 1.5
                }}
              >
                <MenuButton
                  value="formatting"
                  tooltipLabel={showMenuBar ? 'Hide formatting' : 'Show formatting'}
                  size="small"
                  onClick={() => setShowMenuBar((currentState) => !currentState)}
                  selected={showMenuBar}
                  IconComponent={TextFields}
                />

                <MenuButton
                  value="formatting"
                  tooltipLabel={isEditable ? 'Prevent edits (use read-only mode)' : 'Allow edits'}
                  size="small"
                  onClick={() => setIsEditable((currentState) => !currentState)}
                  selected={!isEditable}
                  IconComponent={isEditable ? Lock : LockOpen}
                />

                <Button variant="contained" size="small" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            )
          }}
        >
          {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>
    </>
  )
}
