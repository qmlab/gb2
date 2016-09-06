package gb2.analytics.models

class LogarithmicRegressionModel extends RegressionModel  {
  def distribution(days: Int) = {
    var dist = new Array[Double](days)
    for (i <- 0 until dist.length) {
      dist(i) = Math.log(i + 1)
    }
    dist
  }
}