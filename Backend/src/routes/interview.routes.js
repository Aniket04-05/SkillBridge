const { Router } = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} = require("../controllers/interview.controller");

const interviewRouter = Router();

// ⚡ SCALABILITY BOOST: Apply authentication to ALL routes in this file automatically
interviewRouter.use(authUser);

/**
 * @route POST /api/interview
 * @description Generate new interview report (expects resume PDF file and job description)
 * @access Private
 */
interviewRouter.post("/", upload.single("resume"), generateInterViewReportController);

/**
 * @route GET /api/interview
 * @description Get all interview reports of the logged-in user
 * @access Private
 */
interviewRouter.get("/", getAllInterviewReportsController);

/**
 * @route GET /api/interview/:interviewId
 * @description Get interview report by ID
 * @access Private
 */
interviewRouter.get("/:interviewId", getInterviewReportByIdController); // Cleaned up URL

/**
 * @route POST /api/interview/:interviewId/resume
 * @description Generate and download a tailored resume PDF based on the interview report
 * @access Private
 */
// Cleaned up URL and fixed JSDoc comment to match the POST method
interviewRouter.post("/:interviewReportId/resume", generateResumePdfController);

module.exports = interviewRouter;