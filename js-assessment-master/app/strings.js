exports = (typeof window === 'undefined') ? global : window;

exports.stringsAnswers = {
  reduceString: function(str, amount) {

  },
  wordWrap: function(str, cols) {

  },
  reverseString: function(str) {
    function reverse(str) {
      console.log(str.split('').reverse().join(''));
      return str.split('').reverse().join('');
    }
  }
};
