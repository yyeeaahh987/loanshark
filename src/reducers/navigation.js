import { 
  TOGGLE_SIDEBAR, 
  OPEN_SIDEBAR, 
  CLOSE_SIDEBAR, 
  CHANGE_ACTIVE_SIDEBAR_ITEM, 
  TOGGLE_LOADING
} from '../actions/navigation';

const initialState = {
  sidebarOpened: true,
  sidebarStatic: false,
  activeItem: window.location.pathname,
  loadingActive: false
};

export default function runtime(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpened: !state.sidebarOpened,
      };
    case OPEN_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: true,
      });
    case CLOSE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: false,
      });
    case CHANGE_ACTIVE_SIDEBAR_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loadingActive: !state.loadingActive,
      };
    default:
      return state;
  }
}
