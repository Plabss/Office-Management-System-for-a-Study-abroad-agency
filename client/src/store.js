import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  role: '',
  upload: false,
  addCourse: false,
  addVisa: false,
  assignApplicant:false,
  assignVisaAdmin:false,
  courseDocUpload:false,
  visaDocUpload:false,
}

const changeState = (state = initialState, { type, key, value, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'addElement':
      return { ...state, [key]: value }
    case 'deleteElement':
      const newState = { ...state }
      delete newState[key]
      return newState
    case 'toggleElement':
      if (state[key] !== undefined) {
        return { ...state, [key]: !state[key] }
      }
      return state
    case 'updateElement':
      if (state[key] !== undefined) {
        return { ...state, [key]: value }
      }
      return state // Optionally handle cases where the key does not exist
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
