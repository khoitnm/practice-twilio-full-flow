package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.model;

public class ErrorResponse {
  private String errorCode;
  private String message;
  private Object details;

  public String getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(String errorCode) {
    this.errorCode = errorCode;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Object getDetails() {
    return details;
  }

  public void setDetails(Object details) {
    this.details = details;
  }
}
