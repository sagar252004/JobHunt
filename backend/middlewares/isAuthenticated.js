
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

    try {
        console.log("Incoming request:", req.method, req.url);
        console.log("Headers:", req.headers);
        console.log("Cookies:", req.cookies);
        //console.log("req in auth",req)
        const token = req.cookies?.token;
        //console.log("cook", req.cookies);
        console.log("token",token);


        if (token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false,
            });
        }

        // Verify the JWT token
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false,
            });
        }

        // Attach user id to the request object
        req.id = decode.userId;
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
      
};

export default isAuthenticated;
