import { useDispatch, useSelector } from "react-redux";
import React, { FC, useRef } from 'react'
import { IonCard, IonCardHeader, IonCardContent, IonButton } from "@ionic/react";
import { startCapture, stopCapture, applyFilter } from "./actions";
import { THRESHOLD, NO_FILER, HAARD_CASCADE, YOLO3 } from "./filter_types";
import { State } from "./reducer";
import style from './style.module.css'

export const VideoSandbox: FC = () => {
  const dispatch = useDispatch()
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const isCapturing = useSelector<State, boolean>(
    (state) => state.videoSandbox.isCapturing
  )
  const filterType = useSelector<State, string>(
    (state) => state.videoSandbox.filterType
  )
  const startRc = () => dispatch(startCapture(video.current, canvas.current))
  const stopRc = () => dispatch(stopCapture())
  const applyBF = () => dispatch(applyFilter(THRESHOLD))
  const resetF = () => dispatch(applyFilter(NO_FILER))
  const applyHC = () => dispatch(applyFilter(HAARD_CASCADE))
  const applyYolo = () =>  dispatch(applyFilter(YOLO3))
  
  return (
    <IonCard>
      <IonCardHeader>
        Video Sandbox
      </IonCardHeader>
      <IonCardContent>
        <video ref = { video } hidden = { true } width = { 300 } height = { 200 }></video>
        <canvas ref = { canvas } className = { style.displayCanvas }></canvas>
        <IonButton onClick = { startRc } hidden = { isCapturing }>
          Start Recording
        </IonButton>
        <IonButton onClick = { stopRc } hidden = { !isCapturing }>
          Stop Recording
        </IonButton>
        <IonButton onClick = { applyBF } hidden = { filterType === THRESHOLD || !isCapturing }>
          Apply Binary Filter
        </IonButton>
        <IonButton onClick = { resetF } hidden = { filterType === NO_FILER || !isCapturing}>
          Reset Filter
        </IonButton>
        <IonButton onClick = { applyHC } hidden = { filterType === HAARD_CASCADE || !isCapturing}>
          Apply Haard Cascade
        </IonButton>
        <IonButton onClick = { applyYolo } hidden = { filterType === YOLO3 || !isCapturing}>
          Apply YOLO3
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};