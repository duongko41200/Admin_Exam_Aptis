import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'

export default function ModalFrame({ open, closeModalEdit, children, label }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeModalEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"

      >
        <DialogTitle id="alert-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  )
}
