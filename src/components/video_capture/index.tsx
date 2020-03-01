import React, { FC, useRef } from 'react'

export const VideoCapture: FC = () => {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  return(
    <div>
      <video ref = { video }></video>
      <canvas ref = { canvas }></canvas>
    </div>
  )
}