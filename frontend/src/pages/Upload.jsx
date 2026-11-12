import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileText,
  File,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

function Upload() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const handleFile = (file) => {
    setError("");

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be less than 20 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files[0];

    handleFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
  };

  const handleContinue = async () => {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      /*
       * STEP 1
       * Upload the document to Spring Boot
       */

      const formData = new FormData();

      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        "http://localhost:8080/api/documents/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const uploadText = await uploadResponse.text();

      let uploadData;

      try {
        uploadData = JSON.parse(uploadText);
      } catch {
        uploadData = uploadText;
      }

      console.log(
        "Upload response:",
        uploadResponse.status,
        uploadData
      );

      if (!uploadResponse.ok) {
        setError(
          typeof uploadData === "string"
            ? uploadData
            : "Failed to upload document."
        );

        setUploading(false);

        return;
      }

      /*
       * The backend should return the saved Document.
       */

      const documentId = uploadData.id;

      if (!documentId) {
        setError(
          "Document was uploaded, but no document ID was returned."
        );

        setUploading(false);

        return;
      }

      console.log("Document ID:", documentId);

      /*
       * Save the uploaded document locally
       * so the Analysis page can use it.
       */

      localStorage.setItem(
        "clauseiqDocument",
        JSON.stringify(uploadData)
      );

      /*
       * STEP 2
       * Run clause detection
       */

      const analysisResponse = await fetch(
        `http://localhost:8080/api/clauses/analyze/${documentId}`,
        {
          method: "POST"
        }
      );

      const analysisText = await analysisResponse.text();

      let analysisData;

      try {
        analysisData = JSON.parse(analysisText);
      } catch {
        analysisData = analysisText;
      }

      console.log(
        "Clause analysis response:",
        analysisResponse.status,
        analysisData
      );

      if (!analysisResponse.ok) {
        setError(
          typeof analysisData === "string"
            ? analysisData
            : "Document uploaded, but clause analysis failed."
        );

        setUploading(false);

        return;
      }

      /*
       * Save detected clauses locally too.
       */

      localStorage.setItem(
        "clauseiqClauses",
        JSON.stringify(analysisData)
      );

      /*
       * STEP 3
       * Go to the Analysis page.
       */

      navigate(`/analysis?documentId=${documentId}`);

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        "Unable to connect to ClauseIQ server. Make sure the backend is running."
      );

      setUploading(false);
    }
  };

  return (
    <div className="upload-page">

      {/* NAVBAR */}

      <nav className="upload-navbar">

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

        <div className="nav-right">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/chat">
            AI Assistant
          </Link>

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="upload-container">

        <Link
          to="/dashboard"
          className="back-link"
        >

          <ArrowLeft size={17} />

          Back to Dashboard

        </Link>


        {/* PAGE HEADING */}

        <div className="page-heading">

          <div className="eyebrow">
            DOCUMENT ANALYSIS
          </div>

          <h1>
            Upload your agreement
          </h1>

          <p>
            Upload a contract or agreement and ClauseIQ will
            extract its text, detect important clauses, and
            prepare it for risk and compliance analysis.
          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="upload-card">

          {!selectedFile ? (

            <div
              className={`drop-zone ${
                dragging ? "dragging" : ""
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => {
                setDragging(false);
              }}
              onDrop={handleDrop}
            >

              <div className="upload-icon">

                <UploadIcon size={30} />

              </div>

              <h2>
                Drag and drop your document here
              </h2>

              <p>
                or choose a file from your computer
              </p>

              <label className="choose-button">

                <FileText size={17} />

                Choose Document

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  hidden
                />

              </label>

              <div className="file-info">
                PDF or DOCX · Maximum 20 MB
              </div>

            </div>

          ) : (

            <div className="selected-file">

              <div className="selected-file-icon">

                <File size={28} />

              </div>

              <div className="selected-file-details">

                <h3>
                  {selectedFile.name}
                </h3>

                <p>
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>

              </div>

              <button
                className="remove-button"
                onClick={removeFile}
                type="button"
                disabled={uploading}
              >

                <X size={18} />

              </button>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="error-message">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* FOOTER */}

          <div className="upload-footer">

            <div className="security-note">

              <CheckCircle size={16} />

              <span>
                PDF and DOCX files up to 20 MB
              </span>

            </div>

            <button
              className="continue-button"
              onClick={handleContinue}
              disabled={
                !selectedFile || uploading
              }
              type="button"
            >

              {uploading ? (

                <>
                  <Loader2
                    size={17}
                    className="spinner"
                  />

                  Analyzing Document...

                </>

              ) : (

                <>
                  Continue to Analysis
                </>

              )}

            </button>

          </div>

        </div>


        {/* PROCESS STEPS */}

        <div className="steps-section">

          <div className="section-title">

            <h2>
              What happens next?
            </h2>

            <p>
              ClauseIQ processes your agreement in several stages.
            </p>

          </div>


          <div className="steps-grid">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <h3>
                Document Processing
              </h3>

              <p>
                Your PDF or DOCX file is uploaded and its
                text is extracted automatically.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <h3>
                Clause Detection
              </h3>

              <p>
                Important agreement clauses are detected
                and categorized for review.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <h3>
                Risk & Compliance
              </h3>

              <p>
                Detected clauses can then be evaluated for
                potential risks and compliance requirements.
              </p>

            </div>

          </div>

        </div>

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

        .upload-page {
          min-height: 100vh;
          background: #f7f9fc;
        }

        /* NAVBAR */

        .upload-navbar {
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

        .nav-right {
          display: flex;
          gap: 28px;
        }

        .nav-right a {
          color: #667085;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .nav-right a:hover {
          color: #174ea6;
        }

        /* CONTAINER */

        .upload-container {
          width: 86%;
          max-width: 1050px;
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
          margin-bottom: 32px;
        }

        .back-link:hover {
          color: #174ea6;
        }

        /* HEADING */

        .page-heading {
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #174ea6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 9px;
        }

        .page-heading h1 {
          font-size: 35px;
          margin: 0 0 10px;
          letter-spacing: -1px;
        }

        .page-heading p {
          color: #697386;
          font-size: 15px;
          line-height: 1.6;
          max-width: 700px;
          margin: 0;
        }

        /* UPLOAD CARD */

        .upload-card {
          background: white;
          border: 1px solid #e3e8ef;
          border-radius: 15px;
          padding: 25px;
          box-shadow:
            0 5px 25px rgba(
              31,
              45,
              61,
              0.04
            );
        }

        /* DROP ZONE */

        .drop-zone {
          min-height: 330px;
          border: 2px dashed #ccd6e5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: 0.2s;
          padding: 35px;
        }

        .drop-zone.dragging {
          border-color: #174ea6;
          background: #f4f8ff;
        }

        .upload-icon {
          width: 65px;
          height: 65px;
          border-radius: 16px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .drop-zone h2 {
          margin: 0 0 7px;
          font-size: 18px;
        }

        .drop-zone p {
          margin: 0 0 20px;
          color: #8992a3;
          font-size: 13px;
        }

        .choose-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 17px;
          border-radius: 8px;
          background: #174ea6;
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .choose-button:hover {
          background: #123f89;
        }

        .file-info {
          color: #a0a8b6;
          font-size: 11px;
          margin-top: 15px;
        }

        /* SELECTED FILE */

        .selected-file {
          min-height: 180px;
          border: 1px solid #dce4ef;
          border-radius: 12px;
          background: #f8faff;
          display: flex;
          align-items: center;
          padding: 30px;
          gap: 16px;
        }

        .selected-file-icon {
          width: 58px;
          height: 58px;
          border-radius: 12px;
          background: #edf4ff;
          color: #174ea6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .selected-file-details {
          flex: 1;
          min-width: 0;
        }

        .selected-file-details h3 {
          margin: 0 0 6px;
          font-size: 15px;
          word-break: break-word;
        }

        .selected-file-details p {
          margin: 0;
          color: #8992a3;
          font-size: 12px;
        }

        .remove-button {
          width: 35px;
          height: 35px;
          border: 1px solid #dfe4eb;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667085;
          cursor: pointer;
          flex-shrink: 0;
        }

        .remove-button:hover {
          color: #c0392b;
          border-color: #f0caca;
        }

        .remove-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ERROR */

        .error-message {
          margin-top: 15px;
          padding: 11px 14px;
          background: #fff2f2;
          border: 1px solid #ffd7d7;
          border-radius: 8px;
          color: #c0392b;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        /* FOOTER */

        .upload-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 20px;
        }

        .security-note {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7c8798;
          font-size: 11px;
        }

        .security-note svg {
          color: #258a57;
          flex-shrink: 0;
        }

        .continue-button {
          border: none;
          background: #174ea6;
          color: white;
          border-radius: 8px;
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 185px;
        }

        .continue-button:hover:not(:disabled) {
          background: #123f89;
        }

        .continue-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* LOADING */

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

        /* STEPS */

        .steps-section {
          margin-top: 55px;
        }

        .section-title {
          margin-bottom: 20px;
        }

        .section-title h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }

        .section-title p {
          color: #8992a3;
          margin: 0;
          font-size: 13px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 17px;
        }

        .step-card {
          background: white;
          border: 1px solid #e5e9ef;
          border-radius: 12px;
          padding: 21px;
        }

        .step-number {
          color: #174ea6;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .step-card h3 {
          margin: 0 0 8px;
          font-size: 14px;
        }

        .step-card p {
          margin: 0;
          color: #7d8798;
          font-size: 12px;
          line-height: 1.6;
        }

        /* RESPONSIVE */

        @media (max-width: 700px) {

          .upload-container {
            width: 92%;
          }

          .nav-right {
            display: none;
          }

          .page-heading h1 {
            font-size: 29px;
          }

          .upload-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .security-note {
            justify-content: center;
          }

          .continue-button {
            width: 100%;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .selected-file {
            padding: 20px;
          }

        }

      `}</style>

    </div>
  );
}

export default Upload;