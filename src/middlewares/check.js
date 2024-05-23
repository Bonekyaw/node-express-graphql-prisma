const { GraphQLError } = require("graphql");

exports.validatePhone = (phone) => {
  // phone = phone.replace(/\s/g, "");
  if (phone.match("^[0-9]+$") == null) {
    throw new GraphQLError(
      "Invalid phone number. Please enter the correct one.",
      {
        extensions: {
          code: "BAD REQUEST",
          http: { status: 400 },
        },
      }
    );
  }
  if (phone.slice(0, 2) == "09") {
    phone = phone.substring(2, phone.length);
  }
  if (phone.length < 5 || phone.length > 12) {
    throw new GraphQLError(
      "Invalid phone number. Please enter the correct one.",
      {
        extensions: {
          code: "BAD REQUEST",
          http: { status: 400 },
        },
      }
    );
  }
  return phone;
};

exports.checkPhoneExist = (admin) => {
  if (admin) {
    throw new GraphQLError("This phone number has already registered!.", {
      extensions: {
        code: "CONFLICT",
        http: { status: 409 },
      },
    });
  }
};

exports.checkPhoneIfNotExist = (admin) => {
  if (!admin) {
    throw new GraphQLError("This phone number has not yet registered!.", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};

exports.checkOtpPhone = (otpCheck) => {
  if (!otpCheck) {
    throw new GraphQLError("Phone number is incorrect.", {
      extensions: {
        code: "BAD REQUEST",
        http: { status: 400 },
      },
    });
  }
};

exports.checkOtpErrorIfSameDate = (isSameDate, otpCheck) => {
  if (isSameDate && otpCheck.error === 5) {
    throw new GraphQLError("OTP is wrong 5 times today. Try again tomorrow.", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};