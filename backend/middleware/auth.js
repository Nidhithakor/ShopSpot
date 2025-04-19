import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  let token = req.headers.token;
    if (typeof token === "object") {
      token = JSON.stringify(token);
    }
    if(!token) {
    return res.json({success:false, message:'Not Authorized Login Again'})
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // req.body.userId = token_decode.id;
    req.user = token_decode;

    req.user = { id: token_decode.id }; 
    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(401)
      .json({ success: false, message: `Not Authorized: ${error.message}` });
  }
};

export default authUser;
