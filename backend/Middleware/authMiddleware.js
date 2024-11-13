import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: "Invalid token" });
    }
};
export default authMiddleware;
