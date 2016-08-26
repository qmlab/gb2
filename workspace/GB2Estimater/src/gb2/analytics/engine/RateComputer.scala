package gb2.analytics.engine

import scala.collection.mutable._

class RateComputer(val homeScoreProbs:ListBuffer[Double], val awayScoreProbs:ListBuffer[Double]) {
  var homeProb: Double = 0
  var awayProb: Double = 0
  var drawProb: Double = 0
  
  def execute() = {
    for (i <- 0 until homeScoreProbs.length) {
      for (j <- 0 until awayScoreProbs.length) {
        val prob = homeScoreProbs(i) * awayScoreProbs(j)
        if (i > j) {
          homeProb += prob
        }
        else if (i == j) {
          drawProb += prob
        }
        else {
          awayProb += prob
        }
      }
    }
  }
  
  def getHomeWinOdds(): Double = {
    1 / homeProb
  }
  
  def getAwayWinOdds(): Double = {
    1 / awayProb
  }
  
  def getDrawOdds(): Double = {
    1 / drawProb
  }
}