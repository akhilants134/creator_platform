import { body, validationResult } from "express-validator";

export const changePasswordRules = [
  body("oldPassword").trim().notEmpty().withMessage("Old password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/(?=.*[A-Z])/)
    .withMessage("New password must contain at least one uppercase letter")
    .matches(/(?=.*[0-9])/)
    .withMessage("New password must contain at least one number"),
];

export const forgotPasswordRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

export const resetPasswordRules = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password must contain at least one number"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    errors: errors.array(),
  });
};
