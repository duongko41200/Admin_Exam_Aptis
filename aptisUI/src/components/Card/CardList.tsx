import { Box, CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { Button, useRecordContext } from 'react-admin'
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd'
import '../../components/DnD/styles.css'

import MenuSimple from '../DropDown/DropDownBase'
import FormFlashCardCreate from '../FormCustom/FormFlashCardCreate'
import ModalFrame from '../ModalBase/ModalFrame'

interface Image {
  urlImage: string
  title: string
}

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  objectFit: 'contain'
}

interface FlashCardsProps {
  cards?: Image[]
  deleteCard?: (id: number) => void
  editCard?: (id: number) => void
  onChangePointCard?: (values: any) => void
  CreateFlashCard?: (flashCardData: any) => void
}

export const FlashCards: React.FC<FlashCardsProps> = ({
  cards,
  deleteCard,
  editCard,
  onChangePointCard,
  CreateFlashCard
}) => {
  const record = useRecordContext()
  const [items, setItems] = React.useState<any[]>([])
  const [isOpenModalFrame, setIsOpenModalFrame] = useState(false)
  const [cardsClone, setCardsClone] = React.useState<any[]>([])

  async function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    console.log('sourceId', sourceId)
    console.log('targetId', targetId)
    const nextState = swap(items, sourceIndex, targetIndex)
    const sortCards = nextState.map((index) => cardsClone.find((card) => card.id === index))

    setCardsClone(sortCards)

    setItems(nextState)
  }
  const closeModalCreateFrame = () => {
    setIsOpenModalFrame(false)
  }
  const openModalCreateFrame = () => {
    setIsOpenModalFrame(true)
  }
  const handleSaveCard = () => {
    const cardNew = cardsClone.map(({ id, ...item }) => item)

    onChangePointCard && onChangePointCard(cardNew)
    closeModalCreateFrame()
  }

  const CreatNewCards = (flashCardData) => {
    CreateFlashCard && CreateFlashCard(flashCardData)
    closeModalCreateFrame()
  }

  useEffect(() => {
    const indexcount = cards?.map((_, index) => {
      return index
    })

    if (indexcount) {
      setItems(indexcount)
    }
    if (cards) {
      const newCards = cards.map((item, index) => ({ ...item, id: index }))
      setCardsClone(newCards)
    }
  }, [cards])

  return (
    <>
      <Box sx={{ padding: '5px', width: '100%', display: 'flex', justifyContent: 'end', gap: 2 }}>
        <Button variant="contained" color="info" onClick={handleSaveCard}>
          <Typography variant="h5" align="center" textAlign="center" margin="0" padding="2px">
            Save
          </Typography>
        </Button>

        <Button variant="contained" color="warning" size="small" onClick={openModalCreateFrame}>
          <Typography variant="h5" align="center" textAlign="center" margin="0" padding="2px">
            Create
          </Typography>
        </Button>
      </Box>
      <Box
        className="Appss"
        sx={{
          width: '100%',
          maxHeight: '100%',
          minHeight: 'calc(100vh - 127px)',
          overflow: 'auto',
          userSelect: 'none'
        }}
      >
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id="items"
            boxesPerRow={6}
            rowHeight={300}
            style={{ height: '400px', padding: '10px' }}
          >
            {items.map((item) => (
              <GridItem key={item} style={{position:"absolute"}}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box>
                    <Card
                      sx={{
                        padding: '5px',
                        minHeight: '200px',
                        maxWidth: 'calc(100% - 10px)'
                        // minWidth: '250px'
                      }}
                    >
                      <CardActionArea
                        sx={{
                          pointerEvents: 'none' // Ngừng sự kiện chuột trên toàn bộ CardActionArea
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={(cards ?? [])[item]?.urlImage}
                          sx={{
                            objectFit: 'cover',
                            height: '193px',
                            userSelect: 'none',
                            pointerEvents: 'none'
                          }}
                        />
                      </CardActionArea>
                      <Box
                        sx={{
                          display: 'flex',
                          padding: '16px 0'
                        }}
                      >
                        <Box
                          sx={{
                            padding: '2px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '4px'
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontSize: '20px',
                                overflowWrap: 'break-word',
                                maxWidth: '153px',
                                userSelect: 'none',
                                pointerEvents: 'none'
                              }}
                            >
                              {(cards ?? [])[item]?.title}
                            </Typography>
                          </Box>
                          <Box>
                            <MenuSimple id={item?.id} deleteCard={deleteCard} editCard={editCard} />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </GridContextProvider>
      </Box>

      <ModalFrame open={isOpenModalFrame} closeModalEdit={closeModalCreateFrame} label="">
        {/* <FormCreateWritting addContentQuestion={CreateQuestion} /> */}
        <FormFlashCardCreate addContentQuestion={CreatNewCards} />
      </ModalFrame>
    </>
  )
}
