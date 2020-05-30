import axios from 'axios';

const state = {
  post: {},
  posts: [],
};

const getters = {
  post: (state) => state.post,
  posts: (state) => state.posts,
};

const actions = {
  createNewPost: async function({ commit }, { token, post }) {
    try {
      const header = {
        headers: { 'x-auth-token': token },
      };
      const response = await axios.post('/api/posts', post, header);
      commit('setPost', response.data);
    } catch (err) {
      throw err;
    }
  },
  uploadImageToPost: async function({ commit }, { token, media, postid }) {
    try {
      const header = {
        headers: { 'x-auth-token': token },
      };
      const imageForm = new FormData();
      imageForm.append('media', media, media.name);
      const response = await axios.put(
        `/api/posts/${postid}`,
        imageForm,
        header
      );
      commit('updatePost', response.data.path);
    } catch (err) {
      throw err;
    }
  },
};
const mutations = {
  setPost: (state, post) => (state.post = post),
  updatePost: (state, media) => (state.post.media = media),
};
export default {
  state,
  getters,
  actions,
  mutations,
};
