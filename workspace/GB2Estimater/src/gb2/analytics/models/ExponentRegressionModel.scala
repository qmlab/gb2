package gb2.analytics.models

class ExponentRegressionModel(coefficient: Double, exponent: Double) extends RegressionModel {
  def distribution(days: Int) = {
    var dist = new Array[Double](days)
    for (i <- 0 until dist.length) {
      dist(i) = coefficient * math.pow(i, exponent)
    }
    dist
  }
}