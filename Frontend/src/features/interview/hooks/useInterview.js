import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { InterviewContext } from "../interview.context";
import { 
    getAllInterviewReports, 
    generateInterviewReport, 
    getInterviewReportById, 
    generateResumePdf 
} from "../services/interview.api";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
            return response.interviewReport; // Safely return inside the try block
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error; // Propagate to UI
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(id);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error("Fetch Report Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
            return response.interviewReports;
        } catch (error) {
            console.error("Fetch Reports Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const response = await generateResumePdf({ interviewReportId });
            
            // Generate temporary URL for the Blob
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // 🧹 MEMORY FIX: Clean up the DOM and revoke the Blob URL
            link.parentNode.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000); 

        } catch (error) {
            console.error("PDF Download Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Safe internal async call
        const fetchInitialData = async () => {
            try {
                if (interviewId) {
                    await getReportById(interviewId);
                } else {
                    await getReports();
                }
            } catch (err) {
                // Errors are already handled and logged by the individual fetch functions
                console.error(err);
            }
        };

        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId]); 

    return { 
        loading, 
        report, 
        reports, 
        generateReport, 
        getReportById, 
        getReports, 
        getResumePdf 
    };
};