package gb2.analytics.tests
import org.scalatest.junit.AssertionsForJUnit
import org.junit.Assert._
import org.junit._
import gb2.analytics.models._
import gb2.analytics.engine._
import com.mongodb.casbah.Imports._

class EngineTests {
  @Test def testPowerComputer() {
    val totalDays = 10000
    val windowDays = 700
    val mongoClient = MongoClient()
    val divName = "E1"
    val league = mongoClient("gb2data")(divName(0).toString())
    val model = new ConstantRegressionModel
    var dist = (new ConstantRegressionModel).distribution(windowDays)

    val computer: PowerComputer = new PowerComputer(league, divName, dist);
    computer.execute()
  }

  @Test def testPoissonComputer() {
    val mean = 1.429
    val computer: PoissonComputer = new PoissonComputer(mean)
    val dist = computer.getDistribution()

    assertEquals("Different between 0.2395 and ${dist(0)}", 0.2395, dist(0), 0.001)
    assertEquals("Different between 0.3423 and ${dist(1)}", 0.3423, dist(1), 0.001)
    assertEquals("Different between 0.2446 and ${dist(2)}", 0.2446, dist(2), 0.001)
    assertEquals("Different between 0.1165 and ${dist(3)}", 0.1165, dist(3), 0.001)
    assertEquals("Different between 0.0416 and ${dist(4)}", 0.0416, dist(4), 0.001)
  }
}