package gb2.analytics.tests
import org.scalatest.junit.AssertionsForJUnit
import org.junit.Assert._
import org.junit._
import org.scalatest.mock._
import org.mockito.Mockito._
import gb2.analytics.models._

class ModelTests {
  @Test def testConstantRegressionModel() {
    var dist = (new ConstantRegressionModel).distribution(1000)
    for (i <- 0 until dist.length) {
      assertEquals("Different between ${1} and ${dist(i)}", 1, dist(i), 0)
    }
  }
  
  @Test def testLinearRegressionModelSlope1() {
    var dist = (new LinearRegressionModel(1)).distribution(1000)
    for (i <- 0 until dist.length) {
      assertEquals("Different between ${i} and ${dist(i)}", i , dist(i), 0)
    }
  }
  
  @Test def testLinearRegressionModelSlope_05() {
    testLinearRegressionModel(0.5, 1000)
  }
  
  @Test def testLinearRegressionModelSlope_5() {
    testLinearRegressionModel(5, 1000)
  }
  
  @Test def testExponentRegressionModel_5_2() {
    testExponentRegressionModel(5, 2, 1000)
  }
  
  @Test def testExponentRegressionModel_03_05() {
    testExponentRegressionModel(0.3, 0.5, 1000)
  }
  
  @Test def testExponentRegressionModel_N02_N4() {
    testExponentRegressionModel(-0.2, -4, 1000)
  }
    
  private def testLinearRegressionModel(slope: Double, days: Int) {
    var dist = (new LinearRegressionModel(slope)).distribution(days)
    var lastDay = days - 1;
    assertEquals("Different between ${slope * lastDay} and ${dist(lastDay)}", slope * lastDay, dist(lastDay), 0)
  }
  
  private def testExponentRegressionModel(coefficient: Double, exponent: Double, days: Int) {
    var dist = (new ExponentRegressionModel(coefficient, exponent)).distribution(days)
    var lastDay = days - 1;
    assertEquals("Different between ${coefficient * math.pow(lastDay, exponent)} and ${dist(lastDay)}", coefficient * math.pow(lastDay, exponent), dist(lastDay), 0)
  }
}