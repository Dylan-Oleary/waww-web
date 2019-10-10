const multer  = require('multer');
const shortId = require('shortid');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
    cb(null, `${shortId.generate()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;