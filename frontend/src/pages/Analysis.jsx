import { Link } from "react-router-dom";

export default function Analysis() {

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold">
        AI Contract Analysis
      </h1>


      <div className="bg-white mt-8 p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold">
          Risk Score
        </h2>

        <p className="text-6xl font-bold text-red-600">
          76%
        </p>

      </div>


      <div className="bg-white mt-5 p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold">
          Detected Risks
        </h2>

        <ul className="mt-4">
          <li>⚠ Unlimited Liability Clause</li>
          <li>⚠ Auto Renewal Clause</li>
          <li>⚠ Data Sharing Permission</li>
        </ul>

      </div>


      <Link to="/chat">

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded">
          Chat With AI
        </button>

      </Link>


    </div>
  );
}