const express = require("express");
const {
	getComplaints,
	postComplaints,
	ComplaintsHistory,
} = require("../controllers/complaints.controller");
const {
	login,
	adminlogin,
	resetPassword,
	forgotPassword,
} = require("../controllers/login.controller");
const { logout } = require("../controllers/logout.controller");
const { refresh } = require("../controllers/refreshToken.controller");
const { register, registerAdmin } = require("../controllers/registerController");
const {
	me,
	allUsers,
	getAllPolice,
	getStationPolice,
} = require("../controllers/user.controller");
const {
	citizenDetails,
	policeDetails,
	uploadProfile,
} = require("../controllers/userDetail.controller");
const {
	cloudinary,
	cloudinaryImageUploadMethod,
} = require("../services/imageUpload");
const auth = require("../middleware/auth.middleware");
const multer = require("multer");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const {
	saveExpoToken,
	sendPostNotifications,
} = require("../controllers/notification.controller");
const {
	updateReportStatus,
	updateMissingStatus,
	updateMslfStatus,
	updateUnidPersonStatus,
	updateMobiAppStatus,
} = require("../controllers/complaintStatus.controller");
const User = require("../models/user");
const {
	missingPerson,
	getmissingPerson,
	missingPersonHistory,
} = require("../controllers/missing.controller");
const {
	unIdPerson,
	getUnIdPerson,
	UnIdPersonHistory,
} = require("../controllers/unIdPerson.controller");
const {
	mslf,
	getmslf,
	mslfHistory,
} = require("../controllers/mslf.controller");
const {
	assignReportPolice,
	assignMslf,
	assignMissing,
	assignUnIdPerson,
	assignMobiApp,
} = require("../controllers/assignPolice.controller");
const {
	updatePoliceStatus,
} = require("../controllers/policeStatus.controller");
const { mobiApp, getMobiApp } = require("../controllers/mobiapp.controller");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		next(CustomErrorHandler.wrongCredentials("invalid image file!"));
	}
};

const uploads = multer({ storage, fileFilter });

const router = express.Router();

// post
router.post("/register", register);
router.post("/registerAdmin", registerAdmin);

router.post("/login", login);
router.post("/reset-password", auth, resetPassword);
router.post("/forgot-password", forgotPassword);

router.post("/admin", adminlogin);
router.post("/refresh", refresh);
router.post("/logout", auth, logout);
router.put("/updateReportStatus", auth, updateReportStatus);
router.put("/updateMissingStatus", auth, updateMissingStatus);
router.put("/updateMslfStatus", auth, updateMslfStatus);
router.put("/updateUnidPersonStatus", auth, updateUnidPersonStatus);
router.put("/updateMobiAppStatus", auth, updateMobiAppStatus);
router.post(
	"/complaints",
	auth,
	verify,
	uploads.array("imageProof"),
	uploadComplaintProof,
	postComplaints
);
router.post("/upload-profile", auth, uploads.single("profile"), uploadProfile);
router.post("/sendNoti", auth, sendPostNotifications);
router.post(
	"/missingPerson",
	auth,
	verify,
	uploads.array("imageProof"),
	uploadComplaintProof,
	missingPerson
);
router.post(
	"/unIdPerson",
	auth,
	verify,
	uploads.array("imageProof"),
	uploadComplaintProof,
	unIdPerson
);
router.post(
	"/mslf",
	auth,
	verify,
	uploads.array("imageProof"),
	uploadComplaintProof,
	mslf
);
router.post(
	"/mobileApp",
	auth,
	verify,
	uploads.array("imageProof"),
	uploadComplaintProof,
	mobiApp
);
router.post(
	"/upload-verification",
	auth,
	uploads.single("verification"),
	uploadVerification
);

// router.post("/policeAdminAssignTo", auth, PoliceAdminAssignTo);

// citizen details
router.put("/citizenDetails", auth, citizenDetails);

// police details
router.put("/policeDetails", auth, policeDetails);
router.put("/expoTokens", auth, saveExpoToken);

async function uploadComplaintProof(req, res, next) {
	const { _id, role } = req.user;
	try {
		const urls = [];
		const files = req.files;
		// const { _id, role } = req.user;
		for (const file of files) {
			const { path } = file;
			const { res } = await cloudinaryImageUploadMethod(path, _id);
			urls.push(res);
		}
		req.urls = urls;
		next();
	} catch (error) {
		next(CustomErrorHandler.serverError());
	}
}
async function uploadVerification(req, res, next) {
	const { _id, role } = req.user;
	try {
		const result = await cloudinary.uploader.upload(req.file.path, {
			public_id: `${_id}_verificationPaper`,
			folder: `verificationPaper/${_id}`,
		});
		res.json({ success: true, uri: result.url });
	} catch (error) {
		next(CustomErrorHandler.serverError());
	}
}

async function verify(req, res, next) {
	const { _id, role } = req.user;
	if (role === 3000) {
		const data = await User.findById(_id);
		if (
			data.userDetails &&
			(data.userDetails?.adhaarCard || data.userDetails?.panCard)
		) {
			next();
		} else {
			next(
				CustomErrorHandler.wrongCredentials(
					"Complete your profile before registering complaint"
				)
			);
		}
	} else {
		next();
	}
}

// assign complaint
router.put("/assignReport", auth, stationAdmin, assignReportPolice);
router.put("/assignMissing", auth, stationAdmin, assignMissing);
router.put("/assignMobiApp", auth, stationAdmin, assignMobiApp);
router.put("/assignMSLF", auth, stationAdmin, assignMslf);
router.put("/assignUnIdPerson", auth, stationAdmin, assignUnIdPerson);
router.put("/updatePoliceStatus", auth, PoliceMan, updatePoliceStatus);

// get
router.get("/mydetails", auth, me);
router.get("/allusers", auth, allUsers);
router.get("/complaints", auth, stationAdmin, getComplaints);
router.get("/complaintsHistory", auth, stationAdmin, ComplaintsHistory);
router.get("/getMissingPerson", auth, stationAdmin, getmissingPerson);
router.get("/missingPersonHistory", auth, stationAdmin, missingPersonHistory);
router.get("/getmslf", auth, stationAdmin, getmslf);
router.get("/getMobiApp", auth, stationAdmin, getMobiApp);
router.get("/mslfHistory", auth, stationAdmin, mslfHistory);
router.get("/getUnIdPerson", auth, stationAdmin, getUnIdPerson);
router.get("/unIdPersonHistory", auth, stationAdmin, UnIdPersonHistory);
router.get("/getAllPolice", getAllPolice);
router.get("/getStationPolice", auth, stationAdmin, getStationPolice);

async function stationAdmin(req, res, next) {
	const { _id, role } = req.user;
	if (role === 4000) {
		const stationadmin = await User.findById(_id);
		req.station = stationadmin.userDetails.postingAreaAddress;
	}
	next();
}
async function PoliceMan(req, res, next) {
	const { role } = req.user;
	if (role === 5000) {
		req.police = true;
	} else {
		req.police = false;
	}
	next();
}

module.exports = router;

// user details
// police details view only to police admin
// get police Complaints
