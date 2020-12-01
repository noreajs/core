import { Request, Response, NextFunction } from "express";

/**
 * Error middleware
 *
 * @param err error
 * @param req request
 * @param res response
 * @param next next function
 */
const errorResponseInJsonMiddleware = function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // error exits
  if (err) {
    if (typeof err === "string") {
      return res.status(500).json({
        message: err,
      });
    } else if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
    } else {
      return res.status(500).json(err);
    }
  } else {
    //
    return next();
  }
};

export default errorResponseInJsonMiddleware;
