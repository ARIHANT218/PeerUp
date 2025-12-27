import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
};
