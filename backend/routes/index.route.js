const router = require("express").Router();
const upload = require('../middlewares/upload');
const userController = require("../controllers/auth.controller");
const donorController = require("../controllers/donor.controller");
const adminController = require("../controllers/admin.controller");
const articleController = require("../controllers/article.controller");
const programController = require("../controllers/program.controller");
const commentController = require("../controllers/comment.controller");
const profileController = require("../controllers/profile.controller");
const campaignController = require("../controllers/campaign.controller");
const notificationController = require("../controllers/notification.controller");
const verifyToken = require("../middlewares/authMiddleware");
const isProductManager = require("../middlewares/isProductManager");
const isCoordinator = require("../middlewares/isCoordinator");

router.get("/", (req, res) => {
    res.send("Server is running!");
})

router.post("/sign-up", userController.SignUpUser);
router.post("/sign-in", userController.SignInUser);
router.post("/sign-out", verifyToken, userController.SignOutUser);
router.post("/forgot-password", userController.ForgotPasswordUser);

router.get("/user/get", verifyToken, profileController.GetAllUser);

router.post("/campaign/create", verifyToken, isCoordinator, upload.single("campaignImage"), campaignController.AddCampaign);
router.get("/campaign/get", campaignController.GetCampaigns);
router.get("/campaign/get/:campaignId", campaignController.GetCampaignById);
router.put("/campaign/update/:campaignId", verifyToken, isProductManager, upload.single("campaignImage"), campaignController.UpdateCampaign);
router.delete("/campaign/delete/:campaignId", verifyToken, isProductManager, campaignController.DeleteCampaign);

router.post("/donor/create",  donorController.MidtransTransaction);
router.post("/donor/webhook",  donorController.MidtransWebHook);
router.get("/donor/get", verifyToken, donorController.GetAllDonors);
router.get("/donor/get/donorId/:donorId",  donorController.GetDonorByDonorId);
router.get("/donor/get/campaignId/:campaignId",  donorController.GetDonorByCampaignId);
router.get("/donor/get/message/:campaignId",  donorController.GetDonorMessages);

router.post("/article/create", verifyToken, isCoordinator, upload.fields([{ name: "cover", maxCount: 1 }, { name: "image", maxCount: 5 }]), articleController.AddArticle);
router.get("/article/get", articleController.GetArticle);
router.get("/article/get/:id", articleController.GetArticleById);
router.put("/article/update/:id", verifyToken, isCoordinator, upload.fields([{ name: "cover", maxCount: 1 }, { name: "image", maxCount: 5 }]), articleController.UpdateArticle);
router.delete("/article/delete/:id", verifyToken, isCoordinator, articleController.DeleteArticle);

router.post("/amen/create", donorController.AmenMessage);
router.post("/like/create", articleController.LikeArticle);
router.post("/share/create", articleController.ShareArticle);

router.post("/comment/create", verifyToken, commentController.AddComment);
router.get("/comment/get/:id", commentController.getComment);
router.post("/comment/create/reply", verifyToken, commentController.AddReply);
router.delete("/comment/delete/:id", verifyToken, isProductManager, commentController.DeleteComment);

router.post("/program/create", verifyToken, isProductManager, upload.fields([{ name : "programImage", maxCount: 1 }, { name: "programDocument", maxCount: 1 }]), programController.AddProgram);
router.get("/program/get", programController.GetPrograms);
router.get("/program/get/:programId", programController.GetProgramById);
router.put("/program/update/:programId", verifyToken, isProductManager, upload.fields([{ name : "programImage", maxCount: 1 }, { name: "programDocument", maxCount: 1 }]), programController.UpdateProgram);
router.post("/program/update/status", verifyToken, isProductManager, programController.UpdateStatus);
router.delete("/program/delete/:programId", verifyToken, isProductManager, programController.DeleteProgram);

router.post("/notification/create", verifyToken, notificationController.AddNotification);
router.put("/notification/update/:index", verifyToken, notificationController.MarkNotificationAsRead);
router.delete("/notification/delete/:index", verifyToken, notificationController.DeleteNotification);

router.get("/profile/get/me/:id", profileController.GetMe);
router.get("/profile/get/transaction", verifyToken, profileController.GetDonorByUserId);
router.get("/profile/get/article", verifyToken, profileController.GetArticleByUserId);
router.put("/profile/update", verifyToken, upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "profileAlbum", maxCount: 1 }]), profileController.UpdateUser);
router.delete("/profile/delete/album", verifyToken, profileController.DeleteProfileAlbum);
router.delete("/profile/delete/picture", verifyToken, profileController.DeleteProfilePicture);

router.get("/admin/get/summary", verifyToken, isProductManager, adminController.GetDashboardSummary);
router.put("/admin/update/role", verifyToken, isProductManager, adminController.UpdateRoleUser);
router.delete("/admin/user/delete/:userId", verifyToken, isProductManager, adminController.DeleteUser);
router.delete("/admin/donor/delete/:donorId", verifyToken, isProductManager, adminController.DeleteDonor);

module.exports = router;