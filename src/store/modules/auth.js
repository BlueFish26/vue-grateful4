import axios from 'axios';

const state = {
  auth: {
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    user: {},
  },
};

const getters = {
  auth: (state) => state.auth,
};

const actions = {
  registerUser: async function({ commit }, newUser) {
    try {
      const response = await axios.post('/api/users', newUser);
      commit('setToken', response.data.token);
    } catch (err) {
      throw err;
    }
  },
  loadAuthenticatedUser: async function({ commit }, token) {
    try {
      const response = await axios.get('/api/auth', {
        headers: { 'x-auth-token': token },
      });
      commit('setAuthenticated', true);
      commit('setUser', response.data);
    } catch (err) {
      throw err;
    }
  },
  authenticateUser: async function({ commit }, user) {
    try {
      const response = await axios.post('/api/auth', user);
      commit('setAuthenticated', true);
      commit('setToken', response.data.token);
    } catch (err) {
      throw err;
    }
  },
  loadRequestedUser: async function({ commit }, handle) {
    try {
      const response = await axios.get(`/api/users/@${handle}`);
      console.log(`/api/users/@${handle}`, response);
      commit('setUser', response.data);
    } catch (err) {
      throw err;
    }
  },
};

const mutations = {
  setAuthenticated: (state, authenticated) =>
    (state.auth.isAuthenticated = authenticated),
  setToken: (state, token) => {
    localStorage.setItem('token', token);
    state.auth.token = token;
  },
  setUser: (state, user) => (state.auth.user = user),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
