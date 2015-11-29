import keyMirror from 'key-mirror'

const keys = keyMirror({
  OPTIONS_LOAD: null,
  OPTIONS_SAVE_START: null,
  OPTIONS_SAVE_SUCCESS: null,
  OPTIONS_SAVE_FAILURE: null,
  OPTIONS_UPDATE: null,

  TABS_UPDATE_TABS_PER_WINDOW_BY: null,
  TABS_UPDATE_TABS_PER_WINDOW: null,

  RULES_MOVE_TO_PREVIOUS: null,
  RULES_MOVE_TO_NEXT: null,
  RULES_SELECT_PREVIOUS: null,
  RULES_SELECT_NEXT: null,
  RULES_SELECT: null,
  RULES_ADD: null,
  RULES_REMOVE: null
})

module.exports = keys
module.exports.default = keys
