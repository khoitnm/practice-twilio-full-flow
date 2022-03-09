package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra;

import java.util.concurrent.atomic.AtomicInteger;

public class UniqueTestData {
  // The init value System.nanoTime() is used to increase the uniqueness between different running times.
  // but it's still not guarantee unique (@see more in `uniqueInt()`).
  private final static AtomicInteger SEQUENCE = new AtomicInteger((int)(System.currentTimeMillis() % Integer.MAX_VALUE));

  /**
   * It's unique within one JVM, but not guarantee across many JVMs,
   * so this method is only used for testing only.
   *
   * Note: when using this value to create test data on Twilio, you need to clean up test data after each test case.
   * Otherwise, it could cause duplication in another running time (Jenkin pipeline).
   * @return unique int.
   */
  // Note: this method don't need synchronized because we are using AtomicInteger.
  public static int uniqueInt() {
    return SEQUENCE.incrementAndGet();
  }
}
