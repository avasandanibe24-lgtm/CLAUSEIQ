import { Link } from "react-router-dom";
import { UploadCloud } from "lucide-react";


export default function Upload(){


return(

<div className="min-h-screen bg-gray-100 p-10">


<h1 className="text-4xl font-bold">
Upload Agreement
</h1>


<p className="text-gray-600 mt-3">
Upload your legal document for AI powered analysis.
</p>



<div className="bg-white mt-10 p-10 rounded-xl shadow flex flex-col items-center">


<UploadCloud size={60}/>


<h2 className="text-xl font-bold mt-5">
Drop your PDF here
</h2>


<input

type="file"

className="mt-5 border p-3"

/>



<Link to="/analysis">


<button

className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg"

>

Analyze Document

</button>


</Link>


</div>


</div>

)

}