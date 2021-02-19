export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  center: [51.5074, 0.1278],
})

export const mutations = {
  setList(state, list) {
    state.list = {}

    list.forEach((l) => {
      state.list[l.uid] = l
    })
  },
  setcenter(state, center) {
    state.center = center
  },
}

export const getters = {
  get: (state) => (id) => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },
  list: (state) => Object.values(state.list),
  center: (state) => state.center,
}

export const actions = {
  setList({ commit }, params) {
    commit('setList', params.list)
  },

  setCenter({ commit }, params) {
    commit('setcenter', [params.lat, params.lng])
  },

  async search({ commit }, params) {
    const ret = await this.$axios.get('/api/business/search', {
      params,
    })

    if (ret && ret.data && ret.data.businesses) {
      commit('setList', ret.data.businesses)

      if (ret.data.searchLocation) {
        commit('setcenter', [
          ret.data.searchLocation.latitude,
          ret.data.searchLocation.longitude,
        ])
      }
    }
  },
}
