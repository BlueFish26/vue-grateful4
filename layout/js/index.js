const username = document.getElementById('username');
const password = document.getElementById('password');

const onFocus = function() {
  let parentElement = this.parentNode.parentNode;
  parentElement.classList.add('active');
};

const onBlur = function() {
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
