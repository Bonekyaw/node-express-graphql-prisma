/*
 * Authorization
 * These two functions are same
 * authorise(true, admin, "super", "manager", "editor") === authorise(false, admin, "user")
 * true means that his role must be one of these.
 * false means that his role must not be one of these.
 */
const { GraphQLError } = require("graphql");

const authorise = (permission, admin, ...roles) => {
  const result = roles.includes(admin.role);

  if (!permission && result) {
    throw new GraphQLError("This action is not allowed.", {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    });
  }

  if (permission && !result) {
    throw new GraphQLError("This action is not allowed.", {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    });
  }
};

module.exports = authorise;