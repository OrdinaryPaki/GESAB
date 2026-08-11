export function createServiceSelectState(options, defaultValue = "") {
  const selectedIndex = options.findIndex((option) => option.value === defaultValue);

  return {
    activeIndex: selectedIndex >= 0 ? selectedIndex : 0,
    isOpen: false,
    selectedIndex,
  };
}

export function reduceServiceSelectState(state, action, optionCount) {
  if (action.type === "open") {
    return {
      ...state,
      activeIndex: state.selectedIndex >= 0 ? state.selectedIndex : 0,
      isOpen: true,
    };
  }

  if (action.type === "move" && optionCount > 0) {
    return {
      ...state,
      activeIndex: (state.activeIndex + action.direction + optionCount) % optionCount,
    };
  }

  if (action.type === "select") {
    return {
      activeIndex: action.index,
      isOpen: false,
      selectedIndex: action.index,
    };
  }

  if (action.type === "close") {
    return {
      ...state,
      activeIndex: state.selectedIndex >= 0 ? state.selectedIndex : 0,
      isOpen: false,
    };
  }

  if (action.type === "reset") {
    return {
      activeIndex: 0,
      isOpen: false,
      selectedIndex: -1,
    };
  }

  return state;
}
