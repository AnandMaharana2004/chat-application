const AsyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            statusCode: error.statusCode,
            data: null,
            message: error.message || "server error",
            success: false,

        })
    }
}

export default AsyncHandler 