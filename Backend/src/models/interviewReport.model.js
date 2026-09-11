const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
        trim: true
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
        trim: true
    }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"],
        trim: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
        min: [1, "Day must be at least 1"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"],
        trim: true
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"],
        trim: true
    }]
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
        trim: true
    },
    resume: {
        type: String,
        trim: true
    },
    selfDescription: {
        type: String,
        trim: true
    },
    matchScore: {
        type: Number,
        min: [0, "Score cannot be less than 0"],
        max: [100, "Score cannot exceed 100"],
        default: 0
    },

    technicalQuestions: [questionSchema], 
    behavioralQuestions: [questionSchema],
    
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
        index: true 
    }
}, {
    timestamps: true
});

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = InterviewReport;