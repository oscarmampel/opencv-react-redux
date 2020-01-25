import { SetCaptureState, ApplyFilter } from "./actions"
import { SET_CAPTURE_STATE, APPLY_FILTER } from "./action_types"
import { NO_FILER } from "./filter_types"
import update from 'immutability-helper'

const initialState = {
  videoSandbox: {
    filterType: NO_FILER,
    isCapturing: false
  }
}

export type State = typeof initialState

export function reducer(
  state = initialState,
  action: SetCaptureState | ApplyFilter
) {
  switch(action.type) {
    case SET_CAPTURE_STATE:
      state = update(state, {
        videoSandbox: {
          isCapturing: {
            $set: (action as SetCaptureState).payload.isCapturing
          }
        }
      })
    break
    case APPLY_FILTER:
      state = update(state, {
        videoSandbox: {
          filterType: {
            $set: (action as ApplyFilter).payload.filterType
          }
        }
      })
    break
  }
  return state
}
