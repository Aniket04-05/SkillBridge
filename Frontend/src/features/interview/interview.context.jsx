import React, { createContext, useState, useMemo } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    // ⚡ PERFORMANCE BOOST: Memoize the context value to prevent cascading re-renders
    const contextValue = useMemo(() => ({
        loading, 
        setLoading, 
        report, 
        setReport, 
        reports, 
        setReports
    }), [loading, report, reports]);

    return (
        <InterviewContext.Provider value={contextValue}>
            {children}
        </InterviewContext.Provider>
    );
};