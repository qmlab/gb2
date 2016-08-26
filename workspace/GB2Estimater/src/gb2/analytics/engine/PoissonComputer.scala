package gb2.analytics.engine

import scala.collection.immutable.IndexedSeq
import scala.collection.mutable._

class PoissonComputer(val mean:Double){
  val e = 2.71828
  val max = 16
  def getDistribution(): ListBuffer[Double] = {
    val probs = new ListBuffer[Double]()
    for (i <- 0 until max) {
      probs += Math.pow(mean, i) * Math.pow(e, -mean) / factorial(i)
    }
    probs
  }

  def factorial(k: Int): Double = {
    if (k <= 0) {
      1
    } else {
      k * factorial(k - 1)
    }
  }
}