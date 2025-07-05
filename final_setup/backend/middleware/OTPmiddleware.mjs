import jwt from "jsonwebtoken";

export async function OTPmiddleware(request, response, next) {
    const token = request.cookies?.authToken;

    if (!token) {
        return response.status(401).json({error: "Token not found in cookies"});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        request.authUser = decoded;
        next();
    } catch (error) {
        return response.status(401).json({ error: "Invalid or expired token"})
    }
}