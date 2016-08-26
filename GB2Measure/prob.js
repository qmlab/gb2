// Rating
function get_Estimation(h, d, a) {
  var total_prob = 1/a + 1/d + 1/h;
  var a_expected = 0 * 1/a / total_prob;
  var d_expected = 0.5 * 1/d / total_prob;
  var h_expected = 1 * 1/h / total_prob;
  return (a_expected + d_expected + h_expected);
}

module.exports = {
  getEstimation: get_Estimation,

  getDev: function(h, d, a, r) {
    var estimation = get_Estimation(h, d, a);
    var variance = estimation - r;
    return variance;
  }
}
