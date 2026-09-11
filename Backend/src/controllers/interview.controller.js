// ⚡ FIX 1: Destructuring the PDFParse class from the v2.4.5 package
const { PDFParse } = require("pdf-parse"); 
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const InterviewReport = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        // 1. Validate inputs
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Resume PDF file is required." });
        }

        const { selfDescription, jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        // ⚡ FIX 2: Using the new v2.4.5 class-based parsing logic
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        await parser.destroy(); // Prevents memory leaks!
        
        const resumeText = pdfData.text;

        // 3. Generate AI Report
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "", 
            jobDescription
        });

        // 4. Save to Database
        const interviewReport = await InterviewReport.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Failed to generate interview report.", error: error.message });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await InterviewReport.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found or unauthorized." });
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch interview report.", error: error.message });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await InterviewReport.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch interview reports.", error: error.message });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await InterviewReport.findOne({ 
            _id: interviewReportId, 
            user: req.user.id 
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found or unauthorized." });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({ message: "Failed to generate resume PDF.", error: error.message });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};