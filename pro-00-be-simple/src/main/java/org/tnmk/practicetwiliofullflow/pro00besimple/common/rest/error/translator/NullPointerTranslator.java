package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.translator;

import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.helper.ErrorHelper;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.helper.ErrorResponseHelper;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model.ErrorResponse;

public interface NullPointerTranslator {

  /**
   * @see ErrorHelper#getNullPointerExceptionRoot(Exception)
   */
  static ErrorResponse toErrorResponse(NullPointerException ex) {
    String message = String.join("", ex.getMessage(), ". ", ErrorHelper.getNullPointerExceptionRoot(ex));
    ErrorResponse errorResponse = ErrorResponseHelper.createGeneralErrorResponse(message, null);
    return errorResponse;
  }
}
