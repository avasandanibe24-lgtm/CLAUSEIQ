import { Link } from "react-router-dom";
import { FileText, AlertTriangle, ShieldCheck, Upload } from "lucide-react";


export default function Dashboard(){

return(

<div className="min-h-screen bg-gray-100">


{/* Navbar */}

<nav className="bg-gray-950 text-white px-10 py-5 flex justify-between">

<h1 className="text-2xl font-bold">
ClauseIQ
</h1>


<p>
Dashboard
</p>

</nav>




<div className="p-10">


<h1 className="text-4xl font-bold">
Welcome to ClauseIQ
</h1>


<p className="text-gray-600 mt-2">
AI powered agreement analysis platform
</p>




{/* Stats Cards */}

<div className="grid grid-cols-3 gap-6 mt-10">


<div className="bg-white p-6 rounded-xl shadow">

<FileText size={35}/>

<h2 className="mt-4 text-gray-500">
Documents Analyzed
</h2>

<p className="text-4xl font-bold">
24
</p>

</div>




<div className="bg-white p-6 rounded-xl shadow">


<AlertTriangle size={35}/>


<h2 className="mt-4 text-gray-500">
Risks Detected
</h2>


<p className="text-4xl font-bold text-red-600">
36
</p>


</div>





<div className="bg-white p-6 rounded-xl shadow">

<ShieldCheck size={35}/>


<h2 className="mt-4 text-gray-500">
Compliance Score
</h2>


<p className="text-4xl font-bold text-green-600">
92%
</p>


</div>


</div>





{/* Upload Section */}


<div className="bg-white mt-10 p-8 rounded-xl shadow">


<h2 className="text-2xl font-bold">
Analyze New Agreement
</h2>


<p className="text-gray-600 mt-2">
Upload your contract and let AI identify risks.
</p>



<Link to="/upload">


<button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg flex gap-2 items-center">


<Upload size={20}/>

Upload Document


</button>


</Link>



</div>





{/* Recent Documents */}


<div className="bg-white mt-10 p-8 rounded-xl shadow">


<h2 className="text-2xl font-bold">
Recent Documents
</h2>



<div className="mt-5 space-y-4">


<div className="border p-4 rounded-lg flex justify-between">

<p>
Employment_Agreement.pdf
</p>


<span className="text-red-600">
High Risk
</span>


</div>



<div className="border p-4 rounded-lg flex justify-between">

<p>
Rental_Contract.pdf
</p>


<span className="text-green-600">
Safe
</span>


</div>



</div>


</div>



</div>


</div>

)

}