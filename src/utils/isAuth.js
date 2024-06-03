require("dotenv").config();

const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const checkAuth = (param) => {
  if (!param) {
    throw new GraphQLError("You are not an authenticated user!.", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};

const isAuth = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "BAD REQUEST",
        http: { status: 400 },
      },
    });
  }

  checkAuth(decodedToken);
  return decodedToken.id;
};

module.exports = isAuth;