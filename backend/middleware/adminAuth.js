


import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Login again!" });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has an admin role
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    req.user = decoded; // Store decoded user info in request object
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Invalid token or server error." });
  }
};

export default adminAuth;
