require("dotenv").config();

const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const asyncHandler = require("express-async-handler");
// const { body, validationResult } = require("express-validator");
// const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const { GraphQLError } = require("graphql");

const { checkAdminExist } = require("../../utils/check");
const isAuth = require("../../utils/isAuth");
const { getAdminById } = require("../../services/adminService");
const { updateAdmin } = require("../../services/authService");

const resolvers = {
  Mutation: {
    uploadProfile: asyncHandler(async (parent, args, context, info) => {
      let adminId = info.adminId;
      let imageUrl = args.userInput.imageUrl;
      if (
        validator.isEmpty(imageUrl.trim()) ||
        !validator.matches(imageUrl, "^uploads/images/.*.(png|jpg|jpeg)$")
      ) {
        throw new GraphQLError("This image url is invalid.", {
          extensions: {
            code: "BAD REQUEST",
            http: { status: 400 },
          },
        });
      }

      imageUrl = validator.escape(imageUrl);

      const admin = await getAdminById(adminId);
      checkAdminExist(admin);

      const adminData = {
        profile: imageUrl,
      };
      await updateAdmin(adminId, adminData);

      return {
        message: "Successfully uploaded your profile picture.",
        imageUrl: validator.unescape(imageUrl), // Don't forget to unescape.
      };
    }),
    //
  },
};

// Resolvers Composition like auth middleware in REST

const isAuthenticated = () => (next) => (parent, args, context, info) => {
  checkAdminExist(context.authHeader);
  let token = context.authHeader.split(" ")[1]; // Hey take care!
  
  if (validator.isEmpty(token.trim()) || !validator.isJWT(token)) {
    throw new GraphQLError("Token must not be invalid.", {
      extensions: {
        code: "BAD REQUEST",
        http: { status: 400 },
      },
    });
  }
  token = validator.escape(token);
  const adminId = isAuth(token);
  info.adminId = adminId;

  return next(parent, args, context, info);
};

const resolversComposition = {
  "Mutation.uploadProfile": [isAuthenticated()],
};

const composedResolvers = composeResolvers(resolvers, resolversComposition);
module.exports = composedResolvers;

// const hasRole = (role: string) => next => (root, args, context, info) => {
//   if (!context.currentUser.roles?.includes(role)) {
//     throw new Error('You are not authorized!')
//   }

//   return next(root, args, context, info)
// }
