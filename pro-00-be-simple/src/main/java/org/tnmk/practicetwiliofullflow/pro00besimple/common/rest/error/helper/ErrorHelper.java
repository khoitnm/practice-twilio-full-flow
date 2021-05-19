package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.error.helper;

public interface ErrorHelper {

  /**
   * This method will return detail information of the line which cause NullPointerException including:
   * class name, method name, line number
   * @param exception
   * @return
   */
  static String getNullPointerExceptionRoot(Exception exception) {
    return getErrorLine(exception, 0);
  }

  private static String getErrorLine(Exception exception, int stackTraceIndex) {
    StackTraceElement first = exception.getStackTrace()[stackTraceIndex];
    String fileName = first.getFileName();
    String methodName = first.getMethodName();
    int lineNumber = first.getLineNumber();
    String errorRootCause = String.format("%s#%s():%s", fileName, methodName, lineNumber);
    return "Root: " + errorRootCause;
  }

}
