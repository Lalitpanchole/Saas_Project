/**
 * Profile Routes
 * 
 * Maps /api/profile endpoints for self-service user profile operations.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const profileController = require('../controllers/profileController');
const { updateProfileValidator, changePasswordValidator } = require('../validators/profileValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');

// Setup Multer if available
let uploadMiddleware = (req, res, next) => next();
try {
  const multer = require('multer');
  const uploadDir = path.join(__dirname, '../../public/uploads/profile');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `profile-${req.user.userId}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });

  uploadMiddleware = upload.single('profileImage');
} catch (e) {
  console.warn('Multer not ready, using pass-through middleware');
}

router.use(authenticate);

// Get my profile
router.get('/me', profileController.getProfile);

// Update my profile details
router.put('/me', updateProfileValidator, validate, profileController.updateProfile);

// Change my password
router.post('/change-password', changePasswordValidator, validate, profileController.changePassword);

// Upload profile picture
router.post('/upload-image', uploadMiddleware, profileController.uploadProfileImage);

module.exports = router;
