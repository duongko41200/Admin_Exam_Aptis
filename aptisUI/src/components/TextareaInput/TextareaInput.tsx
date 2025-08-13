import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface TextareaInputProps {
  handleChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  label: string
  register?: UseFormRegister<any> // Đổi loại đúng với loại của register
  name?: string
  rules?: RegisterOptions
  value?: string[]
  isEdit?: boolean
  bgColor?: string | null
}

export default function TextareaInput({
  handleChange,
  label,
  register,
  name,
  rules,
  value = [],
  isEdit = true,
  bgColor = null
}: TextareaInputProps) {
  // Kết hợp thuộc tính register nếu có
  const registerProps = name ? register?.(name, { ...rules }) : {}
  const formattedValue = value.join('\n')

  console.log({ formattedValue, value })

  return (
    <BaseTextareaAutosize
      // minRows={5}
      // maxRows={15}
      placeholder={label}
      defaultValue={formattedValue}
      style={{
        width: '100%',
        height: `${!isEdit ? 'calc(100% - 70px)' : '10px'}`,
        border: '1px solid #222242',
        backgroundColor: `${bgColor ? bgColor : '#ffffff1a'}  `,
        color: '#fff',
        borderRadius: '5px',
        padding: '5px 10px 0 10px',
        pointerEvents: `${!isEdit ? 'none' : 'inherit'}`,
        boxShadow: ' #1565c0 2px 2px 0px 0px',
        opacity: 0.9,
        paddingTop: '20px',
        overflow: 'auto'
      }}
      onChange={handleChange}
      {...registerProps}
    />
  )
}
const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025'
}

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
)
