import logger from "../utils/logger.js";

const adminMiddleware = (req, res, next) => {

    if(req.user.role !== "admin"){
        logger.error("UnAuthorized, Admin Only!")
        return res.status(403).json({
            success : false,
            message : "Admin only!"
        })
    }
}

export default adminMiddleware;