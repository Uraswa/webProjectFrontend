import {createStore} from 'vuex'

export default createStore({
  state: {
    user_id: 0,
    userNickname: "Gosha dudar"
  },
  mutations: {
    setUserId(state, user_id) {
      state.user_id = user_id
    }
  },
  actions: {
    setUserId({commit}, user_id) {
      commit('setUserId', user_id)
    }
  }
})
