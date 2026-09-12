import axios from "axios";

// 1. SCALABILITY: Use Vite's environment variables with a local fallback
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

// Helper function to extract clean error messages from Axios responses
const handleApiError = (err) => {
    if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
    }
    throw new Error("Network error. Please check your connection or try again later.");
};

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    try {
        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        if (selfDescription) formData.append("selfDescription", selfDescription);
        if (resumeFile) formData.append("resume", resumeFile);

        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        // 2. ROUTE SYNC: Updated to match our shorter, cleaner backend route structure (/:interviewId)
        const response = await api.get(`/api/interview/${interviewId}`);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview");
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        // 1. Fetch the PDF as a binary blob
        const response = await api.post(`/api/interview/${interviewReportId}/resume`, null, {
            responseType: "blob"
        });

        // 2. Convert the binary data into a downloadable URL
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // 3. Create a hidden link, trigger the download, and remove the link
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Interview_Report.pdf");
        document.body.appendChild(link);
        
        link.click();
        
        // 4. Clean up memory
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};