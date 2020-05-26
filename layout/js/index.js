const onFocus = function () {
  let parentElement = this.parentNode.parentNode;
  parentElement.classList.add('active');
};

const onBlur = function () {
  let parent = this.parentNode.parentNode;
  if (this.value === '') {
    parent.classList.remove('active');
  }
};

const inputs = document.querySelectorAll('.input');
inputs.forEach((input) => {
  input.addEventListener('focus', onFocus);
  input.addEventListener('blur', onBlur);
});

const redirect = function (url) {
  window.location.href = url;
};

const posts = document.querySelectorAll('.post-section .post');
if (posts) {
  posts.forEach((post) => {
    post.addEventListener('click', () => {
      redirect('single-post.html');
    });
  });
}
