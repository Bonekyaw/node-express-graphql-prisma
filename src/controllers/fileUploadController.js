const asyncHandler = require("express-async-handler");
const { unlink } = require("node:fs/promises");
const path = require("path");
const validator = require("validator");

const { getAdminById } = require("../services/adminService");

const { checkAdmin, checkUploadFile } = require("./../utils/check");

exports.uploadProfile = asyncHandler(async (req, res, next) => {
  // const id = req.params.id;
  const id = req.adminId;
  const image = req.file;
  // console.log("Multiple Images array", req.files);  // For multiple files uploaded

  const admin = await getAdminById(id);
  checkAdmin(admin);
  checkUploadFile(image);
  const imageUrl = image.path.replace("\\", "/");

  if (admin.profile) {
    try {
      await unlink(
        path.join(__dirname, "../..", validator.unescape(admin.profile))
      ); // Delete an old profile image because it accepts just one.
    } catch (error) {
    //   await unlink(
    //     path.join(__dirname, "../..", imageUrl)
    //   ); // Delete an current uploaded profile image unless it continues to call upload graphql api.
      res.status(200).json({
        message: "Successfully uploaded the image.",
        profile: imageUrl,
      });
      return;
    }
  }

  //   admin.profile = imageUrl;
  //   await admin.save();

  res
    .status(200)
    .json({ message: "Successfully uploaded the image.", profile: imageUrl });
});
