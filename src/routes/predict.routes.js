const express = require('express') // import
const multer = require('multer');
const path = require('path');
const router = express.Router() // creat router

//storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")

    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        cb(null, name + '-' + Date.now() + ext);
    }
});

//uplod
const upload = multer({ storage });

router.post("/predict", upload.single('video'), (req, res) => {
    if (req.file) {
        res.status(200).json({
            message: 'Upload successful',
            originalname: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size
        });
    }
    else {

        res.status(400).json("faild");

    }
});

module.exports = router

