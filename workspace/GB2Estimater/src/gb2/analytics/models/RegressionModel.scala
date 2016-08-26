package gb2.analytics.models

trait RegressionModel {
  def distribution(days: Int): Array[Double]
}