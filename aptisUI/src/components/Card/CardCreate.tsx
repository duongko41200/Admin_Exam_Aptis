import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
// import { extractFilenameWithTimestamp } from '@repo/utils/fileUtils';
import { Box } from '@mui/material'
import { useRecordContext } from 'react-admin'
import MenuSimple from '../DropDown/DropDownBase'

interface Image {
  //   fileName: string
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

export const FlashCardsCreate = ({ cards, deleteCard, editCard }) => {
  const record = useRecordContext()

  return (

    <Box
      sx={{
        width: '100%',
        height: 'fit-content',
        // background: '#f4f4f5c4 !important',
        display: 'grid',
        gridTemplateColumns: ' repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px',
        padding: '10px',
        marignTop: '10px'
        // minHeight: 'calc(100vh - 400px)'
      }}
    >
      {cards.length > 0 &&
        cards.map((img: Image, idx: number) => {
          return (
            <Box key={idx}>
              <Card
                sx={{
                  padding: '5px',
                  height: '270px',
                  maxWidth: '430px',
                  minWidth: '250px',
                  maxHeight: '270px',
                  overflow: 'hidden'
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="100"
                    image={`${img.urlImage}`}
                    sx={{ height: '190px' }}
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
                          fontSize: '15px',
                          overflowWrap: 'break-word',
                          maxWidth: '153px'
                        }}
                      >
                        {img.title}
                      </Typography>
                    </Box>
                    <Box>
                      <MenuSimple id={idx} deleteCard={deleteCard} editCard={editCard} />
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          )
        })}
      



      
    </Box>
  )
}
