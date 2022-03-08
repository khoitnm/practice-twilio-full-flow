package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.common.error.exception;

/**
 * This is a exception to indicate that the error comes from the request, not the internal system error,
 * and client app should take a look at it.
 *
 * This simple exception could be use for most of the case.
 * If you need more special exception, you can extends from this class.
 */
public class BadRequestException extends RuntimeException {
  public BadRequestException(String message) {
    super(message);
  }
}
