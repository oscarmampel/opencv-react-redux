import {
  cps,
  call,
  put,
  all,
  take,
  delay,
  race,
  select
} from 'redux-saga/effects'

import { StartCapture, setCaptureState } from './actions'
import {
  START_CAPTURE,
  STOP_CAPTURE,
} from './action_types'
import { THRESHOLD } from './filter_types';
import { State } from './reducer';

declare var cv: any

export default function* saga() {
  yield all([
    call(videoBackground)
  ])
}

function *videoBackground() {
  while(true) {
    const startAction: StartCapture = yield take(START_CAPTURE)
    let stream: MediaStream = yield call(startRecording, startAction)
    yield race([
      call(
        recording,
        startAction.payload.video,
        startAction.payload.canvas,
        stream,
      ),
      take(STOP_CAPTURE)
    ])
  }
}

function *recording(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  stream: MediaStream
) {
  let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4)
  let editedFrame = new cv.Mat(video.height, video.width, cv.CV_8UC4)
  try {
    let cap = new cv.VideoCapture(video)
    yield put(setCaptureState(true))
    while(true) {
      if(!stream) {
        break
      }
      let filterType = yield select((state: State)=> state.videoSandbox.filterType)
      cap.read(frame);
      applyTransformation(frame, editedFrame, filterType)
      cv.imshow(canvas, editedFrame);
      yield delay(1000/30)
    }
  } finally {
    frame.delete()
    editedFrame.delete()
    video.pause()
    for(let track of stream.getTracks()) {
      track.stop()
    }
    yield put(setCaptureState(false))
  }
}

function applyTransformation(frame, editedFrame, filterType){
  switch(filterType){
    case THRESHOLD:
      cv.threshold(frame, editedFrame, 177, 200, cv.THRESH_BINARY);
    break
    default:
      frame.copyTo(editedFrame)
  }
}

function *startRecording(action: StartCapture) {
  let mediaDevices = navigator.mediaDevices
  let stream: MediaStream = yield call([
    mediaDevices,
    mediaDevices.getUserMedia
  ], {
    video: true,
    audio: false
  })
  action.payload.video.srcObject = stream
  yield call([action.payload.video, action.payload.video.play])
  return stream
}
