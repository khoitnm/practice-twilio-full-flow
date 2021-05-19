package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.translator;

import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.helper.ErrorResponseHelper;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model.ErrorResponse;

/**
 * This class is used to transform an exception to the {@link ErrorResponse} in a general way.<br/>
 * If you want to transform an exception in a more specific way,
 * please create another translator class for that specific Exception.
 */
public interface GeneralTranslator {
  static ErrorResponse toErrorResponse(Exception ex) {
    return ErrorResponseHelper.createGeneralErrorResponse(ex);
  }
}
