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
  loadToken: function({ commit }, token) {
    if (token) {
      commit('setAuthenticated', true);
      commit('setToken', token);
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
  logoutUser: function({ commit }) {
    commit('setAuthenticated', false);
    commit('setUser', null);
    commit('setToken', null);
  },
};

const mutations = {
  setAuthenticated: (state, authenticated) =>
    (state.auth.isAuthenticated = authenticated),
  setToken: (state, token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
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
