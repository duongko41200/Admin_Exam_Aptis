import { Box, Button, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useNotify } from 'react-admin'

import SaveIcon from '@mui/icons-material/Save'
import { boxStyles, stylesInpection } from '@renderer/styles'
import { RecordValue } from '@renderer/types/general'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface ContentItem {
  id: number
  title: string
  question: string
  des: string
  note: string
  answer: string
}

interface DataItem {
  id: number
  name: string
  createdAt: Date // This should be a Date object
  totalContent: number // Assuming totalContent is a number
  content: ContentItem[]
}

const FormFlashCardCreate = ({ addContentQuestion }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const notify = useNotify()
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    control,
    handleSubmit,
    watch
  } = useForm<any>({
    mode: 'onTouched'
  })

  const handleSave = async (values: RecordValue) => {
    console.log({ values, image })
    // addContentQuestion({ ...values, image })
    addContentQuestion({ ...values, active: true })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const handleUrlImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    console.log('test image:', url)
    setImageUrl(url)
  }

  return (
    <Box sx={boxStyles}>
      {/* <Title title={`管理ユーザー管理　新規作成`} /> */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              sx={{
                ...stylesInpection.dropzoneContent,
                width: '400px',
                height: '400px',
                position: 'relative'
              }}
            >
              <Box>Ảnh Thẻ</Box>
              {/* <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  opacity: '0',
                  width: '100%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  border: '1px solid',
                  cursor: 'pointer',
                  height: '100%',
                  zIndex: '100'
                }}
              /> */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Selected"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                width: '700px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', columnGap: 20, width: '100%' }}>
                <TextField
                  id="filled-basic"
                  label="Từ Vựng"
                  variant="filled"
                  fullWidth
                  {...register('title')}
                  sx={{ marginTop: '0' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', columnGap: 20, width: '100%' }}>
                <TextField
                  id="filled-basic"
                  label="Url image"
                  variant="filled"
                  fullWidth
                  {...register('urlImage', {
                    required: 'không được bỏ trống',
                    validate: (value) => {
                      const urlPattern = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
                      if (!urlPattern.test(value)) {
                        return 'Url không hợp lệ'
                      }
                      return true
                    }
                  })}
                  error={!!errors.urlImage}
                  helperText={errors.urlImage ? String(errors.urlImage.message) : ''}
                  onChange={handleUrlImageChange}
                  sx={{ marginTop: '0' }}
                />
              </div>

              <div className=" px-1">
                <div className="icon-dictionary  p-0 ">
                  <Box className="bg-white">
                    {/* <!-- //google --> */}
                    <a
                      href={`https://www.google.com/search?q=${getValues('title')}&sca_esv=588712944&sxsrf=AM9HkKnnjxqpovA6jmQe1Eg3nrv-7dLoxQ%3A1701950075179&ei=e7JxZaDMCsbj2roPx5aTiA4&ved=0ahUKEwjg9Z-Nov2CAxXGsVYBHUfLBOEQ4dUDCBA&uact=5&oq=dog&gs_lp=Egxnd3Mtd2l6LXNlcnAiA2RvZzIKECMYgAQYigUYJzIKECMYgAQYigUYJzILEC4YgwEYsQMYgAQyCxAAGIAEGLEDGIMBMgoQABiABBiKBRhDMggQABiABBixAzIFEC4YgAQyCBAAGIAEGLEDMgsQABiABBixAxiDATIFEAAYgARIvwxQAFjWCXABeAGQAQCYAbMBoAHZA6oBAzAuM7gBA8gBAPgBAagCFMICBxAjGOoCGCfCAhYQABiABBjjBBjpBBjqAhi0AhgK2AEBwgIUEAAYgAQY4wQY6QQY6gIYtALYAQHCAhAQABgDGI8BGOoCGLQC2AECwgIQEC4YAxiPARjqAhi0AtgBAsICDBAjGIAEGIoFGBMYJ8ICBBAjGCfCAgsQLhiABBixAxiDAeIDBBgAIEGIBgG6BgYIARABGAG6BgYIAhABGAo&sclient=gws-wiz-serp`}
                      target="”_blank”"
                    >
                      <svg width="24" height="16" fill="none">
                        <path
                          d="M.5 8A7.5 7.5 0 018 .5h8a7.5 7.5 0 010 15H8A7.5 7.5 0 01.5 8z"
                          stroke="#8C8C8C"
                        ></path>
                        <g clip-path="url(#gg-icon_svg__clip0_8801_60807)">
                          <path
                            d="M17.28 8.125c0-.39-.035-.765-.1-1.125H12v2.127h2.96a2.53 2.53 0 01-1.098 1.66v1.38h1.778c1.04-.957 1.64-2.367 1.64-4.042z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M12 13.5c1.485 0 2.73-.493 3.64-1.333l-1.777-1.38c-.493.33-1.123.525-1.863.525-1.432 0-2.645-.968-3.077-2.268H7.085v1.425A5.498 5.498 0 0012 13.5z"
                            fill="#34A853"
                          ></path>
                          <path
                            d="M8.922 9.044A3.306 3.306 0 018.75 8c0-.362.062-.715.172-1.045V5.53H7.085a5.498 5.498 0 000 4.94l1.837-1.425z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M12 4.687c.807 0 1.533.278 2.102.823l1.578-1.578C14.727 3.045 13.483 2.5 12 2.5a5.498 5.498 0 00-4.915 3.03l1.838 1.425c.432-1.3 1.645-2.268 3.077-2.268z"
                            fill="#EA4335"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="gg-icon_svg__clip0_8801_60807">
                            <path fill="#fff" transform="translate(6 2)" d="M0 0h12v12H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </Box>
                  
                  <Box className="bg-white ">
                    {/* <!-- laban dictionary --> */}
                    <a
                      href={`https://dict.laban.vn/find?type=1&query=${getValues('title')}`}
                      target="”_blank”"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 512 512"
                      >
                        <rect x="1" y="0.5" width="21" height="10" rx="7.5" stroke="#8C8C8C"></rect>
                        <path
                          opacity="1"
                          fill="#1E3050"
                          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                        />
                      </svg>
                    </a>

                  </Box>

                  {/* <!-- //camprit dictionary --> */}

                  <Box className="bg-white round-full ">

                    <a
                      href={`https://dictionary.cambridge.org/vi/dictionary/english/${getValues('title')}`}
                      target="”_blank”"
                    >
                      <svg width="24" height="16" fill="none">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="20"
                          height="20"
                          rx="7.5"
                          stroke="#8C8C8C"
                        ></rect>
                        <path
                          d="M18.902 4.057H15.913v.511H16.212a.65.65 0 01.564.32c.119.201.123.444.012.649l-3.215 5.9-1.464-3.49 1.38-2.53a1.627 1.627 0 011.429-.85h.163v-.51h-3.087v.511H12.293a.65.65 0 01.564.32c.119.201.123.444.012.649l-1 1.836-.892-2.125a.483.483 0 01.044-.461.483.483 0 01.408-.22h.327v-.51H8.102v.511H8.248c.682 0 1.293.406 1.557 1.035l1.317 3.14-1.468 2.694-2.596-6.19a.483.483 0 01.044-.46.483.483 0 01.408-.22H7.96v-.51H4v.511h.329c.682 0 1.293.406 1.557 1.035l2.993 7.135a.335.335 0 00.603.03l.39-.716 1.49-2.735 1.436 3.42a.335.335 0 00.603.031l.39-.716 3.616-6.635a1.627 1.627 0 011.43-.85H19v-.51h-.098z"
                          fill="#000"
                        ></path>
                      </svg>
                    </a>

                  </Box>


                </div>
              </div>

              <TextField
                id="filled-basic"
                label="Phiên âm"
                variant="filled"
                fullWidth
                {...register('phonetic')}
              />

              <TextField
                id="filled-basic"
                label="Dịch nghĩa"
                variant="filled"
                fullWidth
                {...register('define')}
              />
              <TextField
                id="filled-basic"
                label="Ví dụ Đặt câu"
                variant="filled"
                fullWidth
                {...register('sencence')}
              />
            </Box>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            width="100%"
            sx={{
              backgroundColor: '#f1f1f1',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            <Button
              startIcon={<SaveIcon />}
              type="submit"
              variant="contained"
              disabled={
                (isLoading === false && (watch('phonetic') || watch('title'))) ||
                watch('sencence') ||
                watch('defind') ||
                watch('urlImage')
                  ? false
                  : true
              }
            >
              保存
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  )
}

export default FormFlashCardCreate
