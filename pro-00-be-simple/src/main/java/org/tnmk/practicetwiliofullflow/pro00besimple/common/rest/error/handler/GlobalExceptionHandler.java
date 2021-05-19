package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.handler;

import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.error.exception.BadRequestException;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model.ErrorResponse;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.translator.GeneralTranslator;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.translator.NullPointerTranslator;

import java.lang.invoke.MethodHandles;
import java.util.NoSuchElementException;

/**
 * <b>Introduction:</b><br/>
 * This class provides a global ways to transform exceptions to {@link ErrorResponse}
 * <p/>
 */
@ResponseBody
@ControllerAdvice
public class GlobalExceptionHandler {
  /**
   * View more at href="http://www.slf4j.org/faq.html#logging_performance
   */
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  /**
   * Handles bad requests exceptions.
   * <p/>
   * Note: please don't consider {@link IllegalArgumentException} as BadRequest
   * because that problem could be caused by some unexpected internal logic.<br/>
   * For example: after receiving a string from some storage, you may want to convert it to a number, but it could cause {@link NumberFormatException}
   * And that {@link NumberFormatException} extends from {@link IllegalArgumentException}.
   * That's an InternalError, not BadRequest.<p/>
   *
   * It means that we <b>should not use {@link Validate}</b> because its methods just throw {@link IllegalArgumentException}.<br/>
   * If you want to validate data, just use annotation in javax.validation.constraints such as Max, NotBlank.<br/>
   * Or you can just throws {@link BadRequestException} after some specific validation logic.<br/>
   * Please view more about different validation ways in `FakeErrorController` in testing.
   *
   * @param ex The exception that was thrown.
   * @return The error response.
   */
  @ExceptionHandler({
      BadRequestException.class,
      HttpRequestMethodNotSupportedException.class,
      ServletRequestBindingException.class,
      TypeMismatchException.class,
      HttpMessageNotReadableException.class,
      HttpClientErrorException.class
  })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleHttpClientErrorException(Exception ex) {
    ErrorResponse errors = GeneralTranslator.toErrorResponse(ex);
    logError(errors, ex);
    return errors;
  }

  /**
   * Handles NoSuchElementException
   *
   * @param ex The exception that was thrown.
   * @return The error response.
   */
  @ExceptionHandler(NoSuchElementException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ErrorResponse handleNoSuchElementException(NoSuchElementException ex) {
    ErrorResponse errors = GeneralTranslator.toErrorResponse(ex);
    logError(errors, ex);
    return errors;
  }

  @ExceptionHandler(NullPointerException.class)
  @ResponseBody
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ErrorResponse handleNullPointerException(final NullPointerException ex) {
    ErrorResponse errors = NullPointerTranslator.toErrorResponse(ex);
    logError(errors, ex);
    return errors;
  }

  /**
   * Any unhandled exception will be considered as Internal error
   * @param ex The exception that was thrown.
   * @return The error response.
   */
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(Exception.class)
  public ErrorResponse handleUnknownInternalException(Exception ex) {
    ErrorResponse errors = GeneralTranslator.toErrorResponse(ex);
    logError(errors, ex);
    return errors;
  }

  private void logError(ErrorResponse errorResponse, Throwable ex) {
    String errorMessage = String.join("",
        "ErrorCode: ", errorResponse.getErrorCode(),
        "\n Message: ", errorResponse.getMessage(),
        "\n Details: ", String.valueOf(errorResponse.getDetails())
    );
    logger.error(errorMessage, ex);
  }
}
