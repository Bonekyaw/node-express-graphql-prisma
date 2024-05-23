require("dotenv").config();

// import { composeResolvers } from "@graphql-tools/resolvers-composition";
const asyncHandler = require("express-async-handler");
// import { v4: uuidv4 } from "uuid";
const moment = require("moment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { GraphQLError } = require("graphql");

const {
  checkPhoneExist,
  checkPhoneIfNotExist,
  validatePhone,
  checkOtpErrorIfSameDate,
  checkOtpPhone,
} = require("../../middlewares/check");

const {
  getAdminByPhone,
  getOtpByPhone,
  createOtp,
  updateOtp,
  createAdmin,
  updateAdmin,
} = require("../../services/authService.js");

const rand = () => Math.random().toString(36).substring(2);

module.exports = {
  Mutation: {
    /*
     * Register an admin using Phone & password only
     * In real world, OTP should be used to verify phone number
     * But in this app, we will simulate fake OTP - 123456
     */
    register: asyncHandler(async (parent, args, context, info) => {
        const phone = validatePhone(args.phone);

        const admin = await getAdminByPhone(phone);
        checkPhoneExist(admin);

        // OTP processing eg. Sending OTP request to Operator
        const otpCheck = await getOtpByPhone(phone);

        const token = rand() + rand();
        let result;
        let otp = "123456";
        if (!otpCheck) {
          const otpData = {
            phone, // phone
            otp, // fake OTP
            rememberToken: token,
            count: 1,
          };

          result = await createOtp(otpData);
        } else {
          const lastRequest = new Date(otpCheck.updatedAt).toLocaleDateString();
          const isSameDate = lastRequest == new Date().toLocaleDateString();

          checkOtpErrorIfSameDate(isSameDate, otpCheck);

          if (!isSameDate) {
            const otpData = {
              otp,
              rememberToken: token,
              count: 1,
              error: 0,
            };
            result = await updateOtp(otpCheck.id, otpData);
          } else {
            if (otpCheck.count === 3) {
              throw new GraphQLError(
                "OTP requests are allowed only 3 times per day. Please try again tomorrow,if you reach the limit.",
                {
                  extensions: {
                    code: "METHOD NOT ALLOWED",
                    http: { status: 405 },
                  },
                }
              );
            } else {
              const otpData = {
                otp,
                rememberToken: token,
                count: {
                  increment: 1,
                },
              };
              result = await updateOtp(otpCheck.id, otpData);
            }
          }
        }

        return {
          message: `We are sending OTP to 09${result.phone}.`,
          phone: result.phone,
          token: result.rememberToken,
        };
    }),

    /*
     * Verify OTP app sent recently
     */

    verifyOtp: asyncHandler(async (parent, args, context, info) => {
        let token;
        let phone = validatePhone(args.userInput.phone);
        let otp = args.userInput.otp;

        // Start validation
        if (validator.isEmpty(args.userInput.token.trim())) {
          throw new GraphQLError("Token must not be empty.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        if (
          validator.isEmpty(otp.trim()) ||
          !validator.isLength(otp, { min: 5, max: 12 }) ||
          !validator.matches(otp, "^[0-9]+$")
        ) {
          throw new GraphQLError("OTP is invalid.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        token = validator.escape(args.userInput.token);

        // End validation

        const admin = await getAdminByPhone(phone);
        checkPhoneExist(admin);

        const otpCheck = await getOtpByPhone(phone);
        checkOtpPhone(otpCheck);

        // Wrong OTP allowed 5 times per day
        const lastRequest = new Date(otpCheck.updatedAt).toLocaleDateString();
        const isSameDate = lastRequest == new Date().toLocaleDateString();

        checkOtpErrorIfSameDate(isSameDate, otpCheck);

        let result;

        if (otpCheck.rememberToken !== token) {
          const otpData = {
            error: 5,
          };
          result = await updateOtp(otpCheck.id, otpData);

          throw new GraphQLError("Token is invalid.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const difference = moment() - moment(otpCheck.updatedAt);
        // console.log("Diff", difference);

        if (difference > 90000) {
          // will expire after 1 min 30 sec
          throw new GraphQLError("OTP is expired.", {
            extensions: {
              code: "FORBIDDEN",
              http: { status: 403 },
            },
          });
        }

        if (otpCheck.otp !== otp) {
          // ----- Starting to record wrong times --------
          if (!isSameDate) {
            const otpData = {
              error: 1,
            };
            result = await updateOtp(otpCheck.id, otpData);
          } else {
            const otpData = {
              error: {
                increment: 1,
              },
            };
            result = await updateOtp(otpCheck.id, otpData);
          }
          // ----- Ending -----------
          throw new GraphQLError("OTP is incorrect.", {
            extensions: {
              code: "UNAUTHORIZED",
              http: { status: 401 },
            },
          });
        }

        const randomToken = rand() + rand() + rand();
        const otpData = {
          verifyToken: randomToken,
          count: 1,
          error: 1,
        };
        result = await updateOtp(otpCheck.id, otpData);

        return {
          message: "Successfully OTP is verified",
          phone: result.phone,
          token: result.verifyToken,
        };
    }),

    /*
     * Verify Token and set up password
     */

    confirmPassword: asyncHandler(async (parent, args, context, info) => {
        let token;
        let phone = validatePhone(args.userInput.phone);
        let password = args.userInput.password;

        // Start validation
        if (validator.isEmpty(args.token.trim())) {
          throw new GraphQLError("Token must not be empty.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        if (
          validator.isEmpty(password.trim()) ||
          !validator.isLength(password, { min: 8, max: 8 }) ||
          !validator.matches(password, "^[0-9]+$")
        ) {
          throw new GraphQLError("OTP is invalid.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        token = validator.escape(args.token);

        // End validation

        const admin = await getAdminByPhone(phone);
        checkPhoneExist(admin);

        const otpCheck = await getOtpByPhone(phone);
        checkOtpPhone(otpCheck);

        if (otpCheck.error === 5) {
          throw new GraphQLError(
            "This request may be an attack. If not, try again tomorrow.",
            {
              extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
              },
            }
          );
        }

        let result;

        if (otpCheck.verifyToken !== token) {
          const otpData = {
            error: 5,
          };
          result = await updateOtp(otpCheck.id, otpData);

          throw new GraphQLError("Token is invalid.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const difference = moment() - moment(otpCheck.updatedAt);
        // console.log("Diff", difference);

        if (difference > 300000) {
          // will expire after 5 min
          throw new GraphQLError("Your request is expired. Please try again.", {
            extensions: {
              code: "FORBIDDEN",
              http: { status: 403 },
            },
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const adminData = { phone: phone, password: hashPassword };
        const newAdmin = await createAdmin(adminData);

        // jwt token
        let payload = { id: newAdmin.id };
        const jwtToken = jwt.sign(payload, process.env.TOKEN_SECRET);

        return {
          message: "Successfully created an account.",
          token: jwtToken,
          phone: phone,
          userId: newAdmin.id,
        };
    }),

    /*
     * Login using phone and password
     */

    login: asyncHandler(async (parent, args, context, info) => {
        let phone = validatePhone(args.userInput.phone);
        let password = args.userInput.password;

        // Start validation
        if (
          validator.isEmpty(password.trim()) ||
          !validator.isLength(password, { min: 8, max: 8 }) ||
          !validator.matches(password, "^[0-9]+$")
        ) {
          throw new GraphQLError("Validation failed.", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        // End validation

        const admin = await getAdminByPhone(phone);
        checkPhoneIfNotExist(admin);

        // Wrong Password allowed 3 times per day
        if (admin.status === "freeze") {
          throw new GraphQLError(
            "Your account is temporarily locked. Please contact us.",
            {
              extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
              },
            }
          );
        }

        let result;

        const isEqual = await bcrypt.compare(password, admin.password);
        if (!isEqual) {
          // ----- Starting to record wrong times --------
          const lastRequest = new Date(admin.updatedAt).toLocaleDateString();
          const isSameDate = lastRequest == new Date().toLocaleDateString();

          if (!isSameDate) {
            const adminData = {
              error: 1,
            };
            result = await updateAdmin(admin.id, adminData);
          } else {
            if (admin.error >= 2) {
              const adminData = {
                status: "freeze",
              };
              result = await updateAdmin(admin.id, adminData);
            } else {
              const adminData = {
                error: {
                  increment: 1,
                },
              };
              result = await updateAdmin(admin.id, adminData);
            }
          }
          // ----- Ending -----------
          throw new GraphQLError("Password is wrong.", {
            extensions: {
              code: "UNAUTHORIZED",
              http: { status: 401 },
            }
          });
        }

        if (admin.error >= 1) {
          const adminData = {
            error: 0,
          };
          result = await updateAdmin(admin.id, adminData);
        }

        let payload = { id: admin.id };
        const jwtToken = jwt.sign(payload, process.env.TOKEN_SECRET);

        return {
          message: "Successfully Logged In.",
          token: jwtToken,
          phone: phone,
          userId: admin.id,
        };
    }),
  }
};

// Resolvers Composition like auth middleware in REST

// const isAuthenticated = () => (next) => (root, args, context, info) => {
//   if (!context.currentUser) {
//     throw new Error("You are not authenticated!");
//   }

//   return next(root, args, context, info);
// };

// const resolversComposition = {
//   "Query.myQuery": [isAuthenticated(), hasRole("EDITOR")],
// };

// const composedResolvers = composeResolvers(resolvers, resolversComposition);
