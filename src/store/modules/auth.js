import axios from 'axios';

const state = {
  auth: {
    isAuthenticated: false,
    token: '',
    user: {},
  },
};

const getters = {
  auth: (state) => state.auth,
};

const actions = {
  async registerUser({ commit }, newUser) {
    try {
      const response = await axios.post('/api/users', newUser);
      commit('setToken', response.data);
    } catch (err) {
      throw err;
    }
  },
  async loadUser({ commit }, token) {
    try {
      const response = await axios.get('/api/users', {
        'x-auth-token': token,
      });
      commit('setUser', response.data);
    } catch (err) {
      throw err;
    }
  },
};

const mutations = {
  setAuthenticated: (state, authenticated) =>
    (state.auth.isAuthenticated = authenticated),
  setToken: (state, token) => (state.auth.token = token),
  setUser: (state, user) => (state.auth.user = user),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
