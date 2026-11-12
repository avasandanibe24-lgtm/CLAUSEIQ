import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Clock,
  Loader2
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [statistics, setStatistics] = useState({
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    complianceScore: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("clauseiqUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("clauseiqUser");
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const documentsResponse = await fetch(
        "http://localhost:8080/api/documents"
      );

      if (!documentsResponse.ok) {
        throw new Error("Failed to load documents.");
      }

      const documentsData = await documentsResponse.json();

      setDocuments(
        Array.isArray(documentsData)
          ? documentsData
          : []
      );

      const statisticsResponse = await fetch(
        "http://localhost:8080/api/clauses/statistics"
      );

      if (!statisticsResponse.ok) {
        throw new Error("Failed to load clause statistics.");
      }

      const statisticsData =
        await statisticsResponse.json();

      setStatistics({
        highRisk: Number(statisticsData.highRisk || 0),
        mediumRisk: Number(statisticsData.mediumRisk || 0),
        lowRisk: Number(statisticsData.lowRisk || 0),
        complianceScore: Number(
          statisticsData.complianceScore || 0
        )
      });

    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to load dashboard data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clauseiqUser");
    localStorage.removeItem("clauseiqDocument");
    localStorage.removeItem("clauseiqClauses");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "Unknown date";
    }
  };

  const analyzedDocuments = documents.filter(
    (document) =>
      document.status &&
      (
        document.status.toUpperCase() === "ANALYZED" ||
        document.status.toUpperCase() === "TEXT_EXTRACTED"
      )
  ).length;

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

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

          <Link
            to="/dashboard"
            className="active"
          >
            Dashboard
          </Link>

          <Link to="/upload">
            Documents
          </Link>

          <Link to="/chat">
            AI Assistant
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </nav>

      {/* MAIN */}

      <main className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <div className="eyebrow">
              WORKSPACE
            </div>

            <h1>
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p>
              Review your agreements and monitor detected risks
              from one place.
            </p>

          </div>

          <Link
            to="/upload"
            className="upload-button"
          >
            <Upload size={17} />
            Upload Agreement
          </Link>

        </div>

        {/* ERROR */}

        {error && (

          <div className="error-banner">

            <AlertTriangle size={17} />

            {error}

          </div>

        )}

        {/* STATS */}

        <div className="stats-grid">

          {/* TOTAL DOCUMENTS */}

          <div className="stat-card">

            <div className="stat-icon blue">
              <FileText size={21} />
            </div>

            <div>

              <span>
                Total Documents
              </span>

              <strong>
                {loading ? (
                  <Loader2
                    size={20}
                    className="spinner"
                  />
                ) : (
                  documents.length
                )}
              </strong>

            </div>

          </div>

          {/* DOCUMENTS PROCESSED */}

          <div className="stat-card">

            <div className="stat-icon green">
              <ShieldCheck size={21} />
            </div>

            <div>

              <span>
                Documents Processed
              </span>

              <strong>
                {loading ? (
                  <Loader2
                    size={20}
                    className="spinner"
                  />
                ) : (
                  analyzedDocuments
                )}
              </strong>

            </div>

          </div>

          {/* HIGH RISK */}

          <div className="stat-card">

            <div className="stat-icon orange">
              <AlertTriangle size={21} />
            </div>

            <div>

              <span>
                High-Risk Clauses
              </span>

              <strong>
                {loading ? (
                  <Loader2
                    size={20}
                    className="spinner"
                  />
                ) : (
                  statistics.highRisk
                )}
              </strong>

            </div>

          </div>

          {/* COMPLIANCE SCORE */}

          <div className="stat-card">

            <div className="stat-icon purple">
              <ShieldCheck size={21} />
            </div>

            <div>

              <span>
                Compliance Score
              </span>

              <strong>
                {loading ? (
                  <Loader2
                    size={20}
                    className="spinner"
                  />
                ) : (
                  `${statistics.complianceScore}%`
                )}
              </strong>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <section className="quick-section">

          <div className="section-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Start working with your agreements.
              </p>

            </div>

          </div>

          <div className="quick-grid">

            <Link
              to="/upload"
              className="quick-card"
            >

              <div className="quick-icon">
                <Upload size={21} />
              </div>

              <div className="quick-content">

                <h3>
                  Upload Agreement
                </h3>

                <p>
                  Upload a PDF or DOCX document for analysis.
                </p>

              </div>

              <ArrowRight size={17} />

            </Link>

            <Link
              to="/chat"
              className="quick-card"
            >

              <div className="quick-icon">
                <MessageSquare size={21} />
              </div>

              <div className="quick-content">

                <h3>
                  Ask AI Assistant
                </h3>

                <p>
                  Ask questions about your agreement.
                </p>

              </div>

              <ArrowRight size={17} />

            </Link>

          </div>

        </section>

        {/* RECENT DOCUMENTS */}

        <section className="documents-section">

          <div className="section-heading">

            <div>

              <h2>
                Recent Documents
              </h2>

              <p>
                Your uploaded agreements.
              </p>

            </div>

            <Link
              to="/upload"
              className="view-link"
            >
              Upload New
              <ArrowRight size={14} />
            </Link>

          </div>

          {loading ? (

            <div className="loading-card">

              <Loader2
                size={25}
                className="spinner"
              />

              <span>
                Loading documents...
              </span>

            </div>

          ) : documents.length === 0 ? (

            <div className="empty-card">

              <div className="empty-icon">
                <FileText size={28} />
              </div>

              <h3>
                No documents yet
              </h3>

              <p>
                Upload your first agreement to start using
                ClauseIQ.
              </p>

              <Link
                to="/upload"
                className="empty-button"
              >
                Upload Agreement
                <ArrowRight size={15} />
              </Link>

            </div>

          ) : (

            <div className="documents-list">

              {documents
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.uploadedAt || 0) -
                    new Date(a.uploadedAt || 0)
                )
                .slice(0, 5)
                .map((document) => (

                  <div
                    className="document-row"
                    key={document.id}
                  >

                    <div className="document-file-icon">
                      <FileText size={21} />
                    </div>

                    <div className="document-info">

                      <h3>
                        {document.fileName ||
                          "Unnamed document"}
                      </h3>

                      <div className="document-meta">

                        <span>
                          Document #{document.id}
                        </span>

                        <span>
                          <Clock size={12} />
                          {formatDate(document.uploadedAt)}
                        </span>

                      </div>

                    </div>

                    <div className="document-row-status">

                      <span className="status-badge">
                        {document.status ||
                          "UPLOADED"}
                      </span>

                    </div>

                    <Link
                      to={`/analysis?documentId=${document.id}`}
                      className="open-button"
                    >
                      Open
                      <ArrowRight size={14} />
                    </Link>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* INFO */}

        <div className="info-banner">

          <ShieldCheck size={18} />

          <div>

            <strong>
              ClauseIQ Document Intelligence
            </strong>

            <p>
              Upload agreements to extract text, identify
              important clauses, and review automated risk
              indicators.
            </p>

          </div>

        </div>

      </main>

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

        .dashboard-page {
          min-height: 100vh;
          background: #f7f9fc;
        }

        .dashboard-navbar {
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
          align-items: center;
          gap: 26px;
        }

        .nav-links a {
          color: #667085;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: #174ea6;
        }

        .logout-button {
          border: none;
          background: transparent;
          color: #667085;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .logout-button:hover {
          color: #c0392b;
        }

        .dashboard-container {
          width: 86%;
          max-width: 1150px;
          margin: auto;
          padding: 42px 0 70px;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #174ea6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 8px;
        }

        .dashboard-header h1 {
          margin: 0 0 8px;
          font-size: 34px;
          letter-spacing: -1px;
        }

        .dashboard-header p {
          margin: 0;
          color: #697386;
          font-size: 14px;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #174ea6;
          color: white;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .upload-button:hover {
          background: #123f89;
        }

        .error-banner {
          background: #fff2f2;
          border: 1px solid #ffd5d5;
          color: #c0392b;
          border-radius: 9px;
          padding: 11px 14px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 38px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: #edf4ff;
          color: #174ea6;
        }

        .stat-icon.green {
          background: #eef8f2;
          color: #278052;
        }

        .stat-icon.orange {
          background: #fff7e8;
          color: #b7791f;
        }

        .stat-icon.purple {
          background: #f3efff;
          color: #7251b5;
        }

        .stat-card span {
          display: block;
          color: #8992a3;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .stat-card strong {
          display: block;
          font-size: 23px;
          line-height: 1;
        }

        .quick-section,
        .documents-section {
          margin-bottom: 35px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .quick-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
          transition: 0.2s;
        }

        .quick-card:hover {
          border-color: #b9c9df;
          transform: translateY(-1px);
        }

        .quick-icon {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-content {
          flex: 1;
        }

        .quick-content h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }

        .quick-content p {
          margin: 0;
          color: #8992a3;
          font-size: 11px;
          line-height: 1.5;
        }

        .quick-card > svg {
          color: #9aa4b4;
        }

        .view-link {
          color: #174ea6;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
        }

        .documents-list {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          overflow: hidden;
        }

        .document-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid #edf0f4;
        }

        .document-row:last-child {
          border-bottom: none;
        }

        .document-file-icon {
          width: 42px;
          height: 42px;
          border-radius: 9px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .document-info {
          flex: 1;
          min-width: 0;
        }

        .document-info h3 {
          margin: 0 0 5px;
          font-size: 13px;
          word-break: break-word;
        }

        .document-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9aa3b1;
          font-size: 10px;
        }

        .document-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-badge {
          background: #eef8f2;
          color: #278052;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
        }

        .open-button {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #174ea6;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        .loading-card {
          min-height: 150px;
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #8992a3;
          font-size: 12px;
        }

        .empty-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          padding: 45px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }

        .empty-card h3 {
          margin: 0 0 6px;
          font-size: 15px;
        }

        .empty-card p {
          margin: 0 0 17px;
          color: #8992a3;
          font-size: 12px;
        }

        .empty-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #174ea6;
          color: white;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .info-banner {
          background: #f0f6ff;
          border: 1px solid #d6e5fb;
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          color: #174ea6;
        }

        .info-banner svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-banner strong {
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .info-banner p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
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

        @media (max-width: 900px) {

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .dashboard-container {
            width: 92%;
          }

          .nav-links {
            display: none;
          }

          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-header h1 {
            font-size: 29px;
          }

          .upload-button {
            width: 100%;
            justify-content: center;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }

          .document-row {
            align-items: flex-start;
          }

          .document-row-status {
            display: none;
          }

        }

        @media (max-width: 500px) {

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .document-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 3px;
          }

          .open-button {
            display: none;
          }

        }

      `}</style>

    </div>
  );
}

export default Dashboard;