import { SaveButton, SimpleForm, ValidateForm } from 'react-admin'
import { FieldValues, SubmitHandler } from 'react-hook-form'
// import DeleteButtonFlexEnd from './DeleteButtonFlexEnd';
import { RecordValue } from '@/types/general'
import { Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

/**
 * Create CustomForm component with delete, save and cancel buttons
 * @param children: JSX.Element[] - children components
 * @param handleSave: SubmitHandler<FieldValues> - function to handle save action
 * @param pathTo: string - path to redirect after cancel button is clicked
 * @param showDeleteButton: boolean - show delete button
 * @param showSaveButton: boolean - show save button
 * @param showCancelButton: boolean - show cancel button
 * @param validate: (values: FieldValues) => Record<string, any> - validate function
 * @param props: any - other props
 * @returns
 */
const CustomForm = ({
  children,
  handleSave,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  showSaveButtonYT = false,
  handleCancel,
  validate,
  ...props
}: {
  children: JSX.Element | JSX.Element[]
  handleSave?: SubmitHandler<FieldValues>
  showDeleteButton?: boolean
  showSaveButton?: boolean
  showCancelButton?: boolean
  alwaysEnable?: boolean
  pathTo?: string
  validate?: ValidateForm
  props?: RecordValue
  showSaveButtonYT?: boolean
  handleCancel?: ()=>void
}) => {
  return (
    <SimpleForm
      onSubmit={handleSave}
      // warnWhenUnsavedChanges={true}
      toolbar={false}
      validate={validate}
      warnWhenUnsavedChanges={true}
      sx={{
        backgroundColor: '#fff',
        marginTop: '20px',
        color: ' rgba(0, 0, 0, 0.87)',
        transition: ' box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        borderRadius: '4px',
        boxShadow:
          '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
        width: '100%',
        minHeight: 'calc(100vh - 100px)',
        padding: '10px',
        position: 'relative'
      }}
    >
      {/* {showDeleteButton ? <DeleteButtonFlexEnd /> : null} */}

      {children}
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
          marginTop: '1rem',
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
        {...props}
      >
        {showSaveButton ? <SaveButton alwaysEnable={alwaysEnable} /> : null} 

        {showSaveButtonYT ? <SaveButton alwaysEnable={alwaysEnable} /> : null}
        {showCancelButton && pathTo ? (
          <Link to={pathTo}>
            <Button type="button" variant="contained" color="error">
              Cancel
            </Button>
          </Link>
        ) : (
          <Button type="button" variant="contained" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </Stack>
    </SimpleForm>
  )
}

export default CustomForm
