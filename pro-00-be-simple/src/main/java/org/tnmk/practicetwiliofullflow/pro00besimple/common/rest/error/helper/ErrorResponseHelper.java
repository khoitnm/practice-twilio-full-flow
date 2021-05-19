package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.helper;

import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model.ErrorCode;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model.ErrorResponse;

/**
 * This class provides a convenient way to work with {@link ErrorResponse}.
 */
public interface ErrorResponseHelper {
  static ErrorResponse createGeneralErrorResponse(Exception ex) {
    return createGeneralErrorResponse(ex, null);
  }

  static ErrorResponse createGeneralErrorResponse(Exception ex, Object details) {
    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setErrorCode(ErrorCode.general);
    errorResponse.setMessage(ex.getMessage());
    errorResponse.setDetails(details);
    return errorResponse;
  }

  static ErrorResponse createGeneralErrorResponse(String message, Object details) {
    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setErrorCode(ErrorCode.general);
    errorResponse.setMessage(message);
    errorResponse.setDetails(details);
    return errorResponse;
  }
}
