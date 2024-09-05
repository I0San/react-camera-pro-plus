import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Camera } from './Camera'
import { CameraRef } from './Camera/components/Camera/types'

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 15%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  padding: 24px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 15%;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
}
`

const DeviceSelect = styled.select`
  @media (max-width: 992px) {
    display: none;
  }
`

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`

const TakePhotoButton = styled(Button)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const RecordVideoButton = styled(Button)<{ isRecording: boolean }>`
  background: url('https://img.icons8.com/ios/50/000000/record.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
  border: solid 4px black;
  border-radius: 50%;
  ${({ isRecording }) => (isRecording ? `background-color: green;` : 'unset')}
  animation: pulsate 1.5s ease-in-out infinite;

  &:hover {
    ${({ isRecording }) => (!isRecording ? `background-color: rgba(0, 0, 0, 0.3);` : 'unset')}
  }
`

const TorchButton = styled(Button)`
  background: url('https://img.icons8.com/ios/50/000000/light.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 60px;
  height: 60px;
  border: solid 4px black;
  border-radius: 50%;

  &.toggled {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const ChangeFacingCameraButton = styled(Button)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`

const ImagePreview = styled.div<{ image: string | null }>`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`

const VideoPreview = styled.video`
  width: 120px;
  @media (max-width: 400px) {
    width: 50px;
  }
`

const FullScreenImagePreview = styled.div<{ image: string | null }>`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const FullScreenVideoPreview = styled.video`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
`

const CloseIcon = styled.div`
  background: url(https://img.icons8.com/ios/50/000000/cancel.png);
  background-color: rgba(255, 255, 255, 0.8);
  background-position: center;
  background-size: 42px;
  background-repeat: no-repeat;
  position: absolute;
  width: 42px;
  height: 42px;
  right: 20px;
  top: 20px;
  cursor: pointer;
  z-index: 1000;
`

const App = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0)
  const [image, setImage] = useState<string | null>(null)
  const [showImage, setShowImage] = useState<boolean>(false)
  const [showVideo, setShowVideo] = useState<boolean>(false)
  const camera = useRef<CameraRef>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined)
  const [torchToggled, setTorchToggled] = useState<boolean>(false)
  // const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((i) => i.kind == 'videoinput')
      setDevices(videoDevices)
    })()
  }, [])

  return (
    <Wrapper>
      {showImage ? (
        <FullScreenImagePreview
          image={image}
          onClick={() => {
            setShowImage(!showImage)
          }}
        />
      ) : showVideo && recordedVideoUrl ? (
        <>
          <CloseIcon
            onClick={() => {
              setShowVideo(!showVideo)
            }}
          />
          <FullScreenVideoPreview autoPlay controls>
            <source src={recordedVideoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </FullScreenVideoPreview>
        </>
      ) : (
        <Control>
          <DeviceSelect
            onChange={(event) => {
              setActiveDeviceId(event.target.value)
            }}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
          </DeviceSelect>
          {image && (
            <ImagePreview
              image={image}
              onClick={() => {
                setShowImage(!showImage)
              }}
            />
          )}
          {recordedVideoUrl && (
            <VideoPreview
              onClick={() => {
                setShowVideo(!showVideo)
              }}
            >
              <source src={recordedVideoUrl} type="video/webm" />
              Your browser does not support the video tag.
            </VideoPreview>
          )}
          <TakePhotoButton
            onClick={() => {
              if (camera.current) {
                const photo = camera.current.takePhoto()
                console.log(photo)
                setRecordedVideoUrl(null)
                setImage(photo as string)
              }
            }}
          />
          <RecordVideoButton
            isRecording={camera.current?.isRecording() || false}
            onClick={() => {
              if (camera.current) {
                if (camera.current.isRecording()) {
                  camera.current.stopRecording().then(() => {
                    const resultingVideo = camera.current ? camera.current.getRecordedVideo() : null
                    console.log(resultingVideo)
                    if (resultingVideo) {
                      console.log(resultingVideo)
                      setImage(null)
                      setRecordedVideoUrl(null)
                      setRecordedVideoUrl(URL.createObjectURL(resultingVideo))
                    }
                  })
                } else {
                  camera.current.startRecording()
                }
              }
            }}
          />
          {camera.current?.torchSupported && (
            <TorchButton
              className={torchToggled ? 'toggled' : ''}
              onClick={() => {
                if (camera.current) {
                  setTorchToggled(camera.current.toggleTorch())
                }
              }}
            />
          )}
          <ChangeFacingCameraButton
            disabled={numberOfCameras <= 1}
            onClick={() => {
              if (camera.current) {
                const result = camera.current.switchCamera()
                console.log(result)
              }
            }}
          />
        </Control>
      )}
      <Camera
        ref={camera}
        aspectRatio="cover"
        facingMode="environment"
        numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
        videoSourceDeviceId={activeDeviceId}
        errorMessages={{
          noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
          permissionDenied: 'Permission denied. Please refresh and give camera permission.',
          switchCamera:
            'It is not possible to switch camera to different one because there is only one video device accessible.',
          canvas: 'Canvas is not supported.',
          mediaRecorderNotSupported: 'MediaRecorder is not supported.',
        }}
        videoReadyCallback={() => {
          console.log('Video feed ready.')
        }}
      />
    </Wrapper>
  )
}

export default App
