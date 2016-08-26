package gb2.analytics.models

class LinearRegressionModel(slope: Double) extends RegressionModel {
  def distribution(days: Int) = {
    var dist = new Array[Double](days)
    for (i <- 0 until dist.length) {
      dist(i) = i * slope
    }
    dist
  }
}