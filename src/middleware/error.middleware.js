import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {

    let error = err;

    // If error is not ApiError, convert it
    if (!(error instanceof ApiError)) {
        error = new ApiError(
            500,
            error.message || "Internal Server Error",
            error?.errors || []
        );
    }

    return res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors,
        data: error.data
    });
};

export default errorMiddleware;