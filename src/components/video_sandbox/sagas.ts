import {
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
import { THRESHOLD, HAARD_CASCADE, YOLO3 } from './filter_types';
import { State } from './reducer';
import {
    HAAR_CASCADE_FILE_PATH,
} from '../../lib/util'

declare var cv: any

export function* videoBackground() {
    while (true) {
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

function* recording(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    stream: MediaStream
) {
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4)
    let editedFrame = new cv.Mat(video.height, video.width, cv.CV_8UC4)
    try {
        let cap = new cv.VideoCapture(video)
        yield put(setCaptureState(true))
        while (true) {
            if (!stream) {
                break
            }
            let filterType = yield select((state: State) => state.videoSandbox.filterType)
            cap.read(frame);
            yield call(applyTransformation, frame, editedFrame, filterType)
            cv.imshow(canvas, editedFrame);
            yield delay(1000 / 30)
        }
    } finally {
        frame.delete()
        editedFrame.delete()
        video.pause()
        for (let track of stream.getTracks()) {
            track.stop()
        }
        yield put(setCaptureState(false))
    }
}

function applyTransformation(frame, editedFrame, filterType) {
    switch (filterType) {
        case THRESHOLD:
            cv.threshold(frame, editedFrame, 177, 200, cv.THRESH_BINARY);
            break
        case (HAARD_CASCADE):
            applyHaarCascade(frame, editedFrame)
            break
        case (YOLO3):
            applyYolo(frame, editedFrame)
            break
        default:
            frame.copyTo(editedFrame)
    }
}

function applyHaarCascade(frame, editedFrame) {
    frame.copyTo(editedFrame)
    cv.cvtColor(editedFrame, frame, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let faceCascade = new cv.CascadeClassifier();
    faceCascade.load(HAAR_CASCADE_FILE_PATH);
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(frame, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
        let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
            faces.get(i).y + faces.get(i).height);
        cv.rectangle(editedFrame, point1, point2, [255, 0, 0, 255]);
    }
    editedFrame.copyTo(frame)
    faceCascade.delete(); faces.delete();
}

function applyYolo(frame, editedFrame) {
    let detector = new cv.SimpleBlobDetector()
    let detectedPoints = new cv.KeyPointVector()
    detector.detect(frame, detectedPoints)
    cv.drawKeypoints(frame, detectedPoints, editedFrame)
}

function* startRecording(action: StartCapture) {
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
