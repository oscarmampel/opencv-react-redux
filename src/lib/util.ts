import { call } from 'redux-saga/effects'

declare const cv

export const HAAR_CASCADE_FILE_PATH = 'haarcascade_frontalface_default.xml'

export const SSD_MOBILE_MODEL_FILE_PATH = 'frozen_inference_graph.pb'

export const SSD_MOBILE_CFG_FILE_PATH = 'coco_config.cfg'


export function* createFileFromUrl(url: string, path: string = url) {
  const response: Response = yield call(fetch, url)
  if (!response.ok){
    throw Error('Can not fetch the file')
  }
  const buffer: ArrayBuffer = yield call([response, response.arrayBuffer])
  const data = new Uint8Array(buffer);
  cv.FS_createDataFile('/', path, data, true, false, false);
}