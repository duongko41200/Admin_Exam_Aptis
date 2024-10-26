import { Container, FormGroup, TextField } from '@mui/material'
import { GET_CONTENT_AUDIO } from '@renderer/store/features/speakVoice/slice'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Initialize SpeechRecognition API
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const rec = recognition ? new recognition() : null

const VoiceRecord = () => {
  const [text, setText] = useState<string>('')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState<boolean>(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const statusMic = useSelector((state: any) => state.speaking.statusActiveMic)
  const contentRecord = useSelector((state: any) => state.speaking.contentRecord)
  const audioStore = useSelector((state: any) => state.speaking.audio)
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize MediaRecorder API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (typeof MediaRecorder === 'undefined') {
            console.error('MediaRecorder is not supported in this browser.')
            setIsMediaRecorderSupported(false)
            return
          }

          const mimeType = 'audio/webm' // Default MIME type for compatibility
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data)
            }
          }

          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
            const audioUrl = URL.createObjectURL(audioBlob)
            console.log({ audioBlob })
            setAudioURL(audioUrl)
            dispatch(GET_CONTENT_AUDIO(URL.createObjectURL(audioBlob)))
            audioChunksRef.current = []
          }
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error)
          setIsMediaRecorderSupported(false)
        })
    } else {
      console.error('MediaDevices not supported.')
      setIsMediaRecorderSupported(false)
    }
  }, [])

  const handleStartRecording = () => {
    if (mediaRecorderRef.current) {
      setIsRecording(true)
      mediaRecorderRef.current.start()
      console.log('Audio recording started.')
    } else {
      console.error('MediaRecorder is not initialized or not supported.')
    }
  }

  const handleStopRecording = () => {
    if (rec) {
      rec.stop()
      setIsRecording(false)
      console.log('Speech recognition stopped.')
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      console.log('Audio recording stopped.')
    }
  }
  console.log('value statusMic:', statusMic)
  useEffect(() => {
    setAudioURL(audioStore)
  }, [])

  useEffect(() => {
    if (statusMic) {
      handleStartRecording()
    } else {
      handleStopRecording()
    }
  }, [statusMic])

  return (
    <Container sx={{ mt: 5, textAlign: 'center', background: '#1414140f' }}>
      <FormGroup sx={{ mb: 5 }}>
        <TextField
          multiline
          rows={8}
          variant="outlined"
          placeholder="Speak something..."
          value={contentRecord}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          id="textbox"
        />
        {audioURL && (
          <audio
            controls
            src={audioURL}
            style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Your browser does not support the audio element.
          </audio>
        )}
      </FormGroup>

      {/* {audioURL && (
        <audio
          controls
          src={audioURL}
          style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        >
          Your browser does not support the audio element.
        </audio>
      )} */}
    </Container>
  )
}

export default VoiceRecord
