module.exports = {
  onFocus: function(event) {
    let parentElement = event.target.parentNode.parentNode;
    parentElement.classList.add('active');
  },
  onBlur: function(event) {
    let parent = event.target.parentNode.parentNode;
    if (event.target.value === '') {
      parent.classList.remove('active');
    }
  },
};
