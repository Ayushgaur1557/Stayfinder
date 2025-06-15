const express = require('express');
const router  = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: '/tmp' });             // temp file storage

//-------------------------------------
// 1) Upload **by link**
//-------------------------------------
router.post('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;                       // plain URL string

    const result = await cloudinary.uploader.upload(link, {
      public_id: `Airbnb/Places/${Date.now()}`,      // forces folder creation
    });

    return res.status(200).json(result.secure_url);  // <- URL you save to Mongo
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//-------------------------------------
// 2) Upload **local files**
//-------------------------------------
router.post('/upload', upload.array('photos', 100), async (req, res) => {
  try {
    const imageArray = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: `Airbnb/Places/${Date.now()}-${file.originalname}`,
      });
      imageArray.push(result.secure_url);
    }

    return res.status(200).json(imageArray);         // array of URLs
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.use('/user',     require('./user'));
router.use('/places',   require('./place'));
router.use('/bookings', require('./booking'));

module.exports = router;
