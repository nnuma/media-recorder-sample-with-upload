import React from 'react'
import { UPLOAD_DIR } from '../../config'
import styles from './Recorder.module.css'

const RECORDER_PLAYBACK_ID = 'recorder-playback'
const RECORDER_OPTIONS: MediaRecorderOptions = {
  audioBitsPerSecond: 64000,
  videoBitsPerSecond: 2500000,
  mimeType: 'video/webm;codecs=h264',
}
const API_ENDPOINT_UPLOAD = '/api/upload'

export function Recorder() {
  const [stream, setStream] = React.useState<MediaStream | undefined>(undefined)
  const [recorder, setRecorder] = React.useState<MediaRecorder | undefined>(
    undefined
  )
  const [isRecording, setIsRecording] = React.useState(false)

  const startStreaming = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!navigator?.mediaDevices || !window?.URL) {
      alert('This button will only work on a browser.')
      return
    }
    const s = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    const playback = document.getElementById(
      RECORDER_PLAYBACK_ID
    ) as HTMLVideoElement | null
    if (playback) {
      playback.srcObject = s
      playback.play()
    }
    setStream(s)
    const r = new MediaRecorder(s, RECORDER_OPTIONS)
    r.ondataavailable = ({ data }) => {
      const formData = new FormData()
      formData.append('file', new File([data], 'recorded.webm'))
      fetch(API_ENDPOINT_UPLOAD, {
        method: 'POST',
        headers: {},
        body: formData,
      })
    }
    setRecorder(r)
  }

  const startRecording = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!stream?.active || !recorder) {
      alert('Video camera is inactive.')
      return
    }
    recorder.start(10000)
    setIsRecording(true)
  }
  const stopRecording = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!stream?.active || !recorder) {
      alert('Video camera is inactive.')
      return
    }
    recorder.stop()
    setIsRecording(false)
  }

  return (
    <div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <p>Step1.</p>
          <button
            className={styles.button}
            onClick={startStreaming}
            disabled={stream?.active}
          >
            Enable camera
          </button>
        </div>{' '}
        <div className={styles.card}>
          <p>Step2.</p>
          {!isRecording ? (
            <button
              className={styles.button}
              onClick={startRecording}
              disabled={!stream?.active}
            >
              Start recording
            </button>
          ) : (
            <>
              <button
                className={`${styles.button} ${styles.recording}`}
                onClick={stopRecording}
                disabled={!stream?.active}
              >
                Stop recording
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        <div>
          <p>Check your video &darr;</p>
          <video controls width={320} height={200} id={RECORDER_PLAYBACK_ID} />
        </div>
      </div>
      {isRecording && (
        <div className={styles.grid}>
          <p>
            Recorded video will be uploaded to{' '}
            <code className={styles.code}>{UPLOAD_DIR}</code> in your Next.js
            directory.
          </p>
        </div>
      )}
    </div>
  )
}
