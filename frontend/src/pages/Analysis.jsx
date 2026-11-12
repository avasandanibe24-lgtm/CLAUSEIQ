import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  RefreshCw
} from "lucide-react";

function Analysis() {
  const [searchParams] = useSearchParams();

  const documentId = searchParams.get("documentId");

  const [clauses, setClauses] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalysis = async () => {
    if (!documentId) {
      setError("No document ID was provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get document information
      const documentResponse = await fetch(
        `http://localhost:8080/api/documents`
      );

      if (documentResponse.ok) {
        const documents = await documentResponse.json();

        const currentDocument = documents.find(
          (doc) => String(doc.id) === String(documentId)
        );

        setDocument(currentDocument || null);
      }

      // Get clauses for this document
      const clauseResponse = await fetch(
        `http://localhost:8080/api/clauses/document/${documentId}`
      );

      const clauseText = await clauseResponse.text();

      let clauseData;

      try {
        clauseData = JSON.parse(clauseText);
      } catch {
        clauseData = [];
      }

      if (!clauseResponse.ok) {
        setError(
          typeof clauseData === "string"
            ? clauseData
            : "Failed to load clause analysis."
        );

        setLoading(false);
        return;
      }

      setClauses(Array.isArray(clauseData) ? clauseData : []);

      setLoading(false);

    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        "Unable to connect to ClauseIQ server. Make sure the backend is running."
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [documentId]);

  const highRiskCount = clauses.filter(
    (clause) =>
      clause.riskLevel &&
      clause.riskLevel.toLowerCase() === "high"
  ).length;

  const mediumRiskCount = clauses.filter(
    (clause) =>
      clause.riskLevel &&
      clause.riskLevel.toLowerCase() === "medium"
  ).length;

  const lowRiskCount = clauses.filter(
    (clause) =>
      !clause.riskLevel ||
      clause.riskLevel.toLowerCase() === "low"
  ).length;

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) {
      return "low";
    }

    return riskLevel.toLowerCase();
  };

  return (
    <div className="analysis-page">

      {/* NAVBAR */}

      <nav className="analysis-navbar">

        <Link
          to="/dashboard"
          className="brand"
        >
          <div className="brand-icon">
            C
          </div>

          <div>
            <div className="brand-name">
              ClauseIQ
            </div>

            <div className="brand-subtitle">
              Agreement Intelligence
            </div>
          </div>
        </Link>

        <div className="nav-links">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/upload">
            Upload
          </Link>

          <Link to="/chat">
            AI Assistant
          </Link>

        </div>

      </nav>


      {/* MAIN */}

      <main className="analysis-container">

        <Link
          to="/dashboard"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>


        {/* HEADER */}

        <div className="analysis-header">

          <div>

            <div className="eyebrow">
              DOCUMENT ANALYSIS
            </div>

            <h1>
              Agreement Analysis
            </h1>

            <p>
              Review the clauses detected from your uploaded
              agreement.
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={fetchAnalysis}
            disabled={loading}
          >
            <RefreshCw size={16} />

            Refresh
          </button>

        </div>


        {/* DOCUMENT INFO */}

        {document && (

          <div className="document-card">

            <div className="document-icon">

              <FileText size={25} />

            </div>

            <div className="document-details">

              <h2>
                {document.fileName}
              </h2>

              <p>
                Document ID: {document.id}
              </p>

            </div>

            <div className="document-status">

              {document.status || "ANALYZED"}

            </div>

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <div className="state-card">

            <Loader2
              size={30}
              className="spinner"
            />

            <h2>
              Loading analysis...
            </h2>

            <p>
              ClauseIQ is retrieving the detected clauses.
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="error-card">

            <AlertTriangle size={25} />

            <div>

              <h2>
                Analysis could not be loaded
              </h2>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* RESULTS */}

        {!loading && !error && (

          <>

            {/* SUMMARY */}

            <div className="summary-grid">

              <div className="summary-card">

                <div className="summary-icon">
                  <FileText size={21} />
                </div>

                <div>

                  <span>
                    Total Clauses
                  </span>

                  <strong>
                    {clauses.length}
                  </strong>

                </div>

              </div>


              <div className="summary-card high-card">

                <div className="summary-icon high-icon">
                  <AlertTriangle size={21} />
                </div>

                <div>

                  <span>
                    High Risk
                  </span>

                  <strong>
                    {highRiskCount}
                  </strong>

                </div>

              </div>


              <div className="summary-card medium-card">

                <div className="summary-icon medium-icon">
                  <AlertTriangle size={21} />
                </div>

                <div>

                  <span>
                    Medium Risk
                  </span>

                  <strong>
                    {mediumRiskCount}
                  </strong>

                </div>

              </div>


              <div className="summary-card low-card">

                <div className="summary-icon low-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>

                  <span>
                    Low Risk
                  </span>

                  <strong>
                    {lowRiskCount}
                  </strong>

                </div>

              </div>

            </div>


            {/* CLAUSES */}

            <div className="clauses-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Detected Clauses
                  </h2>

                  <p>
                    Clauses extracted and categorized by ClauseIQ.
                  </p>

                </div>

              </div>


              {clauses.length === 0 ? (

                <div className="empty-card">

                  <FileText size={35} />

                  <h2>
                    No clauses detected
                  </h2>

                  <p>
                    No qualifying clauses were found in this
                    document.
                  </p>

                </div>

              ) : (

                <div className="clauses-list">

                  {clauses.map((clause, index) => (

                    <div
                      className="clause-card"
                      key={clause.id || index}
                    >

                      <div className="clause-top">

                        <div className="clause-number">
                          CLAUSE {index + 1}
                        </div>

                        <span
                          className={`risk-badge ${getRiskClass(
                            clause.riskLevel
                          )}`}
                        >
                          {clause.riskLevel || "Low"} Risk
                        </span>

                      </div>


                      <div className="clause-type">

                        {clause.clauseType ||
                          "General"}

                      </div>


                      <p className="clause-text">

                        {clause.clauseText ||
                          "No clause text available."}

                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* NOTE */}

            <div className="analysis-note">

              <AlertTriangle size={18} />

              <p>
                Risk levels shown here are automated indicators
                generated from detected agreement language. They
                are intended to support document review and are
                not a substitute for professional legal advice.
              </p>

            </div>

          </>

        )}

      </main>


      {/* STYLES */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f7f9fc;
          color: #172033;
        }

        .analysis-page {
          min-height: 100vh;
          background: #f7f9fc;
        }

        .analysis-navbar {
          height: 74px;
          background: white;
          border-bottom: 1px solid #e7ebf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: inherit;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #174ea6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .brand-name {
          font-size: 17px;
          font-weight: 800;
        }

        .brand-subtitle {
          color: #8993a5;
          font-size: 10px;
          margin-top: 1px;
        }

        .nav-links {
          display: flex;
          gap: 28px;
        }

        .nav-links a {
          color: #667085;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .nav-links a:hover {
          color: #174ea6;
        }

        .analysis-container {
          width: 86%;
          max-width: 1150px;
          margin: auto;
          padding: 40px 0 70px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #667085;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 30px;
        }

        .back-link:hover {
          color: #174ea6;
        }

        .analysis-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #174ea6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 8px;
        }

        .analysis-header h1 {
          margin: 0 0 8px;
          font-size: 34px;
          letter-spacing: -1px;
        }

        .analysis-header p {
          margin: 0;
          color: #697386;
          font-size: 14px;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 15px;
          border: 1px solid #dce2ea;
          background: white;
          border-radius: 8px;
          color: #4e5969;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .refresh-button:hover:not(:disabled) {
          border-color: #174ea6;
          color: #174ea6;
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .document-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 13px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .document-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .document-details {
          flex: 1;
          min-width: 0;
        }

        .document-details h2 {
          margin: 0 0 4px;
          font-size: 14px;
          word-break: break-word;
        }

        .document-details p {
          margin: 0;
          color: #8a93a3;
          font-size: 11px;
        }

        .document-status {
          padding: 6px 10px;
          background: #eef8f2;
          color: #268052;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          padding: 17px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .summary-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .high-icon {
          background: #fff0f0;
          color: #c0392b;
        }

        .medium-icon {
          background: #fff8e7;
          color: #b7791f;
        }

        .low-icon {
          background: #eef8f2;
          color: #278052;
        }

        .summary-card span {
          display: block;
          color: #8992a3;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .summary-card strong {
          font-size: 22px;
          line-height: 1;
        }

        .clauses-section {
          margin-top: 10px;
        }

        .section-heading {
          margin-bottom: 17px;
        }

        .section-heading h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }

        .section-heading p {
          margin: 0;
          color: #8992a3;
          font-size: 12px;
        }

        .clauses-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .clause-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 13px;
          padding: 20px;
        }

        .clause-card:hover {
          border-color: #cbd6e5;
        }

        .clause-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 12px;
        }

        .clause-number {
          color: #174ea6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .risk-badge {
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
        }

        .risk-badge.high {
          background: #fff0f0;
          color: #c0392b;
        }

        .risk-badge.medium {
          background: #fff8e7;
          color: #b7791f;
        }

        .risk-badge.low {
          background: #eef8f2;
          color: #278052;
        }

        .clause-type {
          display: inline-block;
          background: #f0f4fa;
          color: #536176;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .clause-text {
          margin: 0;
          color: #4f5b6d;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .state-card,
        .empty-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 13px;
          padding: 60px 25px;
          text-align: center;
          color: #8992a3;
        }

        .state-card svg,
        .empty-card svg {
          color: #174ea6;
          margin-bottom: 12px;
        }

        .state-card h2,
        .empty-card h2 {
          margin: 0 0 7px;
          color: #172033;
          font-size: 17px;
        }

        .state-card p,
        .empty-card p {
          margin: 0;
          font-size: 12px;
        }

        .error-card {
          background: #fff5f5;
          border: 1px solid #ffd8d8;
          border-radius: 13px;
          padding: 20px;
          display: flex;
          gap: 13px;
          color: #c0392b;
        }

        .error-card h2 {
          margin: 0 0 5px;
          font-size: 15px;
        }

        .error-card p {
          margin: 0;
          font-size: 12px;
        }

        .analysis-note {
          margin-top: 25px;
          background: #fffaf0;
          border: 1px solid #f4e2b8;
          border-radius: 10px;
          padding: 13px 15px;
          display: flex;
          gap: 10px;
          color: #876b32;
        }

        .analysis-note svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .analysis-note p {
          margin: 0;
          font-size: 11px;
          line-height: 1.6;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 850px) {

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .analysis-container {
            width: 92%;
          }

          .nav-links {
            display: none;
          }

          .analysis-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .analysis-header h1 {
            font-size: 29px;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .document-card {
            align-items: flex-start;
          }

          .document-status {
            display: none;
          }

        }

      `}</style>

    </div>
  );
}

export default Analysis;