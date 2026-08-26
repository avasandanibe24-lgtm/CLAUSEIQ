import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Brain } from "lucide-react";


export default function Home(){

return(

<div className="min-h-screen bg-gray-950 text-white">


{/* Navbar */}

<nav className="flex justify-between items-center px-10 py-6">

<h1 className="text-2xl font-bold">
ClauseIQ
</h1>


<Link to="/login">

<button className="bg-blue-600 px-5 py-2 rounded-lg">
Login
</button>

</Link>


</nav>



{/* Hero Section */}

<div className="flex flex-col items-center justify-center mt-24 text-center">


<h1 className="text-6xl font-bold">

AI Powered Agreement
<br/>

<span className="text-blue-500">
Compliance Navigator
</span>

</h1>



<p className="text-gray-400 text-xl mt-6 max-w-2xl">

Analyze contracts, identify hidden risks,
and understand complex legal agreements
using Artificial Intelligence.

</p>



<Link to="/login">

<button className="mt-10 bg-blue-600 px-10 py-4 rounded-xl text-lg hover:bg-blue-700">

Start Analysis

</button>

</Link>


</div>




{/* Features */}

<div className="grid grid-cols-3 gap-8 px-20 mt-24">


<div className="bg-gray-900 p-8 rounded-xl">

<FileText size={40}/>

<h2 className="text-xl font-bold mt-4">
Document Intelligence
</h2>

<p className="text-gray-400 mt-2">

Extract important clauses from agreements.

</p>

</div>



<div className="bg-gray-900 p-8 rounded-xl">

<Brain size={40}/>

<h2 className="text-xl font-bold mt-4">
AI Contract Analysis
</h2>

<p className="text-gray-400 mt-2">

Ask questions and get AI powered explanations.

</p>

</div>



<div className="bg-gray-900 p-8 rounded-xl">

<ShieldCheck size={40}/>

<h2 className="text-xl font-bold mt-4">
Risk Detection
</h2>

<p className="text-gray-400 mt-2">

Find hidden risks and compliance issues.

</p>

</div>


</div>


</div>

)

}