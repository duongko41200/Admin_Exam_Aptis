import { Box } from '@mui/material'
import { useRef, useState } from 'react'
import { BoxTranslate } from '../BoxTranslate/BoxTranslate'

interface DictionaryData {
  text?: string
  audio?: string
  definition?: string[]
  example?: string[]
  typeWord?: string
  synonyms?: string[]
  word?: string
  translate?: string
}

export const HighlightMouse = ({ children }) => {
  const [dictionarys, setDictionarys] = useState<DictionaryData>({})
  const [isModalTranslate, setIsModalTranslate] = useState<boolean>(false)
  const [selectedText, setSelectedText] = useState<string>('')
  const [lengthText, setLengthText] = useState<number>(0)
  const [isTextHighlighted, setIsTextHighlighted] = useState<boolean>(false)
  const [iconLeftPosition, setIconLeftPosition] = useState<number>(0)
  const [iconTopPosition, setIconTopPosition] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)

  const textElementRef = useRef<HTMLDivElement | null>(null)

  const handleMouseUp = async (event: React.MouseEvent) => {
 
    setIsModalTranslate(false)
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('[contenteditable="true"]')
    ) {
      return
    }
    // setShowModal(false)
    const selection = window.getSelection()
    const selectedText = getSelectedText()
    if (selectedText) {
      setSelectedText(selectedText)
    }
    setLengthText(selectedText.split(' ').filter((value) => value).length)

    setIsTextHighlighted(selectedText.length > 0)

    // Tọa độ
    const textElement = textElementRef.current

    if (textElement) {
      const textElementRect = textElement.getBoundingClientRect()

      if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
        setShowModal(false)
        setDictionarys({})
        const range = selection.getRangeAt(0)
        const rangeRect = range.getBoundingClientRect()

        // Tính toán vị trí của biểu tượng
        setIconLeftPosition(rangeRect.left - textElementRect.left + rangeRect.width / 2)
        setIconTopPosition(
          rangeRect.top - textElementRect.top + rangeRect.height / 2 + window.scrollY + 20
        )

        // console.log('top position', iconTopPosition, 'range', rangeRect)
        if (selectedText && selectedText.trim() !== '') {
          setIsModalTranslate(true)
        } else {
          setIsModalTranslate(false)
        }
      } else {
        if (selection) {
          selection.removeAllRanges()
        }
        setIsModalTranslate(false)
      }
    }
  }

  const getSelectedText = (): string => {
    const selection = window.getSelection()
    return selection ? selection.toString() : ''
  }

  const closeModalTranslate = () => {
    setIsModalTranslate(false)
    setShowModal(false)
  }

  const showModalTranslate = () => {
    setIsModalTranslate(false)
    setShowModal(true)
    const textElement = textElementRef.current

    // if (textElement) {

    //   const textElementRect = textElement.getBoundingClientRect()
    //   const selection = window.getSelection()

    //   if (selection && selection.rangeCount >= 0) {
    //     const range = selection.getRangeAt(0).getBoundingClientRect()

    //     setIconLeftPosition(window.innerWidth / 2)

    //     let iconTopPosition = range.height - textElementRect.top + 100
    //     console.log('text icon top position sdfsdfdsfsddsf', iconTopPosition)
    //     setIconTopPosition(iconTopPosition)

    //     setIsModalTranslate(false)
    //     setShowModal(true)
    //     // const selection = window.getSelection();
    //     if (selection) {
    //       selection.removeAllRanges()
    //     }

    //     console.log('textElementRect', textElementRect)
    //     console.log('height:', window.innerHeight)
    //   } else {
    //     console.log('No text selected')
    //     setShowModal(false)
    //     setIsModalTranslate(false)
    //     if (selection) {
    //       selection.removeAllRanges()
    //     }
    //   }
    // }
  }

  return (
    <>
      <div
        ref={textElementRef}
        style={{ position: `${isModalTranslate ? 'relative' : 'unset'}` }}
        onMouseUp={handleMouseUp}
      >
        {children}

        <Box
          sx={{
            position: 'absolute',
            left: `${iconLeftPosition}px`,
            top: `${iconTopPosition}px`,
            fontSize: '16px',
            background: 'black',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 1000,
            cursor: 'pointer',
            display: `${isModalTranslate ? 'block' : 'none'}`
          }}
          onClick={() => showModalTranslate()}
        >
          Dịch
        </Box>
        {/* )} */}

        <BoxTranslate
          showModal={showModal}
          CloseModalTranslate={closeModalTranslate}
          selectedText={selectedText}
          // :type="'check'"
          // closeModal={closeModalPreview}
        ></BoxTranslate>
      </div>
    </>
  )
}
