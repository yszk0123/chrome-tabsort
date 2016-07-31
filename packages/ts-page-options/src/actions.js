/* global chrome */
import _ from 'lodash';
import {
  CHROME_OPTIONS_UPDATE_STATE,
  OPTIONS_LOAD_START_WITH_STATE,
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE_STATE,
  OPTIONS_SERIALIZE,
  OPTIONS_DESERIALIZE_FAILURE,
  OPTIONS_UPDATE_SERIALIZED_STATE,
} from './constants';
import * as StorageUtils from '../utils/StorageUtils';

const STORAGE_KEY = 'state';

export const load = () => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START });

  StorageUtils.get(STORAGE_KEY)
    .then((state) => {
      dispatch({ type: OPTIONS_LOAD_SUCCESS, state });
      dispatch({ type: OPTIONS_UPDATE_STATE, state });
    })
    .catch((error) => {
      dispatch({ type: OPTIONS_LOAD_FAILURE, error });
    });
};

export const loadWithState = (state) => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START_WITH_STATE, state });
  dispatch({ type: OPTIONS_LOAD_SUCCESS, state });
  dispatch({ type: OPTIONS_UPDATE_STATE, state });
};

export const save = () => (dispatch, getState) => {
  dispatch({ type: OPTIONS_SAVE_START });

  const state = getState();

  StorageUtils.set(STORAGE_KEY, state)
    .then(() => {
      chrome.runtime.sendMessage({ type: CHROME_OPTIONS_UPDATE_STATE, state });
      dispatch({ type: OPTIONS_SAVE_SUCCESS });
    })
    .catch((error) => {
      dispatch({ type: OPTIONS_SAVE_FAILURE, error });
    });
};

export const serialize = () => (dispatch, getState) => {
  dispatch({
    type: OPTIONS_SERIALIZE,
    value: JSON.stringify(_.omit(getState(), ['options'])),
  });
};

export const deserialize = (value) => {
  let result = null;

  try {
    result = JSON.parse(value);
  }
  catch (err) {
    return {
      type: OPTIONS_DESERIALIZE_FAILURE,
    };
  }

  return loadWithState(result);
};

export const updateSerializedState = (value) => {
  return {
    type: OPTIONS_UPDATE_SERIALIZED_STATE,
    value,
  };
};
