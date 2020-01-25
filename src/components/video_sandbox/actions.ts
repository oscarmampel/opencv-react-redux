import {
  START_CAPTURE,
  STOP_CAPTURE,
  APPLY_FILTER,
  SET_CAPTURE_STATE
} from './action_types'

export type ApplyFilter = ReturnType<typeof applyFilter>
export type StopCapture = ReturnType<typeof stopCapture>
export type StartCapture = ReturnType <typeof startCapture>
export type SetCaptureState = ReturnType <typeof setCaptureState>


export const applyFilter = (filterType: string) => {
  return {
    type: APPLY_FILTER,
    payload: {
      filterType
    }
  }
}

export const setCaptureState = (isCapturing: boolean) => {
  return {
    type: SET_CAPTURE_STATE,
    payload: {
      isCapturing
    }
  }
}

export const stopCapture = () => {
  return {
    type: STOP_CAPTURE
  }
}

export const startCapture = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  return {
    type: START_CAPTURE,
    payload: {
      video: video,
      canvas: canvas,
    }
  }
}
