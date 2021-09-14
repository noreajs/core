export default class Logger {
  /**
   * Display log according to debug mode
   * @param message error message
   * @param optionalParams parameters
   */
  public static log(message?: any, ...optionalParams: any[]) {
    if (
      process.env.DEBUG_MODE ? `${process.env.DEBUG_MODE}` === "true" : true
    ) {
      console.log(
        `[${process.platform} - PID:${process.pid}] ${message}`,
        ...optionalParams
      );
    }
  }

  /**
   * Display error: bypass the debug mode
   * @param message error message
   * @param optionalParams optional parameters
   */
  public static err(message?: any, ...optionalParams: any[]) {
    console.log(
      `[${process.platform} - PID:${process.pid}] ${message}`,
      ...optionalParams
    );
  }
}
