const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const getFolderName = (fieldname) => {
    switch (fieldname) {
        case 'profilePicture':
            return 'annur-rahman-rahim/profile/picture';
        case 'profileAlbum':
            return 'annur-rahman-rahim/profile/album';
        case 'cover':
            return 'annur-rahman-rahim/article';
        case 'image':
            return 'annur-rahman-rahim/image';
        case 'campaignImage':
            return 'annur-rahman-rahim/campaign';
        case 'programImage':
            return 'annur-rahman-rahim/program'
        default:
            return 'annur-rahman-rahim/others';
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const folder = getFolderName(file.fieldname);
        const filename = `${Date.now()}-${path.parse(file.originalname).name}`;
        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png'],
            public_id: filename,
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png) are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;