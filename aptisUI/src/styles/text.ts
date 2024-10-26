import { customStyleBox, wrapperCenter } from './index'
export const stylesText = {
  dropzone: {
    position: 'relative',
    margin: '20px 0',
    top: '0',
    left: '0',
    // border: '2px dashed #4267b2',
    width: '100%',
    height: '80px',
		cursor: 'pointer',
	
  },
  dropzoneContent: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fafafb',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: '500'
  },
  inputFile: {
    opacity: '0',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    border: '1px solid',
    cursor: 'progress'
  },
  infoBox: {
    ...customStyleBox,
    maxHeight: '100vh',
    overflow: 'auto'
  },
  listBox: {
    ...customStyleBox,
    maxHeight: '500px',
    overflow: 'auto'
  },
  imageBox: {
    display: 'flex',
    gap: '10',
    justifyContent: 'space-between',
    width: '500px',
    padding: '10px 20px'
  },
  imageContainer: {
    ...wrapperCenter,
    width: '150px',
    height: 'fit-content'
  },
  deleteButton: {
    ...wrapperCenter
  },
  loadingBox: {
    display: 'flex',
    gap: '10',
    justifyContent: 'space-between',
    width: '500px',
    padding: '20px 20px'
  }
}
