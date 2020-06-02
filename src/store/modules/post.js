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
  loadPostsForUser: async function({ commit }, { token, handle }) {
    try {
      const header = {
        headers: { 'x-auth-token': token },
      };
      const response = await axios.get(`/api/posts/handle/${handle}`, header);
      commit('loadPosts', response.data);
    } catch (err) {
      throw err;
    }
  },
  loadPostById: async function({ commit }, postid) {
    try {
      const response = await axios.get(`/api/posts/${postid}`);
      commit('setPost', response.data);
    } catch (err) {
      throw err;
    }
  },
  loadCommentsByPostId: async function({ commit }, postid) {
    try {
      const response = await axios.get(`/api/posts/comments/${postid}`);
      commit('setComments', response.data.comments);
    } catch (err) {
      throw err;
    }
  },
  addCommentToPost: async function({ commit }, { token, postid, text }) {
    try {
      const header = {
        headers: { 'x-auth-token': token },
      };
      const data = {
        text: text,
      };
      const response = await axios.post(
        `/api/posts/comment/${postid}`,
        data,
        header
      );
      commit('addComment', response.data);
    } catch (err) {
      throw err;
    }
  },
};
const mutations = {
  setPost: (state, post) => {
    state.post = post;
    state.post.comments = [];
  },
  updatePost: (state, media) => (state.post.media = media),
  loadPosts: (state, posts) => (state.posts = posts),
  setComments: (state, comments) => (state.post.comments = comments),
  addComment: (state, comment) => state.post.comments.unshift(comment),
};
export default {
  state,
  getters,
  actions,
  mutations,
};
