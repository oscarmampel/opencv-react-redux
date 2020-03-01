import { all, call } from 'redux-saga/effects'
import { videoBackground } from '../components/video_sandbox/sagas'
import {
  createFileFromUrl,
  HAAR_CASCADE_FILE_PATH,
  SSD_MOBILE_CFG_FILE_PATH,
  SSD_MOBILE_MODEL_FILE_PATH
} from './util'

export default function* saga() {
  yield all([
    call(videoBackground),
    call(loadOpencvFileData)
  ])
}

function *loadOpencvFileData() {
  yield call(createFileFromUrl, HAAR_CASCADE_FILE_PATH)
  yield call(createFileFromUrl, SSD_MOBILE_CFG_FILE_PATH)
  yield call(createFileFromUrl, SSD_MOBILE_MODEL_FILE_PATH)
}