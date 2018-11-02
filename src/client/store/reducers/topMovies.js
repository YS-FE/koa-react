
function topMovies(state = [], action) {
  switch (action.type) {
    case 'ADD_TOP_MOVIES':
      return [...state].concat(action.value)
    default:
      return state;
  }
}

export default  topMovies;