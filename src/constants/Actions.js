import keyMirror from 'key-mirror'

const keys = keyMirror({
  CHROME_OPTIONS_UPDATE_STATE: null,

  BACKGROUND_UPDATE_STATE: null,

  OPTIONS_LOAD: null,
  OPTIONS_LOAD_SUCCESS: null,
  OPTIONS_LOAD_FAILURE: null,
  OPTIONS_SAVE_START: null,
  OPTIONS_SAVE_SUCCESS: null,
  OPTIONS_SAVE_FAILURE: null,
  OPTIONS_UPDATE_STATE: null,

  TABS_UPDATE_TABS_PER_WINDOW_BY: null,
  TABS_UPDATE_TABS_PER_WINDOW: null,

  RULES_MOVE_TO_PREVIOUS: null,
  RULES_MOVE_TO_NEXT: null,
  RULES_SELECT_PREVIOUS: null,
  RULES_SELECT_NEXT: null,
  RULES_SELECT: null,
  RULES_MODIFY_REGEXP_AT: null,
  RULES_TOGGLE_DISABLE_AT: null,
  RULES_TOGGLE_ISOLATE_AT: null,
  RULES_ADD: null,
  RULES_REMOVE_AT: null
})

module.exports = keys
module.exports.default = keys
