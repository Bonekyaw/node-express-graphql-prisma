const express = require('express');

const router = express.Router();
const upload = require('../../utils/uploadFile');
const { uploadProfile } = require('../../controllers/fileUploadController');

// Upload single image
router.put('/admins/upload', upload.single('avatar'), uploadProfile );
// Upload multiple images
// router.put('/admins/:id/upload',upload.array('avatar'), uploadProfile );

module.exports = router;