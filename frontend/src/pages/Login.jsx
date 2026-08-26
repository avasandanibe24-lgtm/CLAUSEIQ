import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";


export default function Login(){

const navigate = useNavigate();


return (

<div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 flex items-center justify-center">


<div className="bg-white w-96 p-8 rounded-2xl shadow-2xl">


<div className="flex justify-center">

<ShieldCheck 
size={50}
className="text-blue-600"
/>

</div>


<h1 className="text-3xl font-bold text-center mt-5">

ClauseIQ

</h1>


<p className="text-gray-500 text-center mt-2">

AI Agreement Intelligence Platform

</p>



<input

className="w-full border rounded-lg p-3 mt-8"

placeholder="Email"

/>



<input

className="w-full border rounded-lg p-3 mt-4"

placeholder="Password"

type="password"

/>



<button

onClick={()=>navigate("/dashboard")}

className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"

>

Login

</button>



<p className="text-center text-gray-500 mt-5 text-sm">

Secure AI powered contract analysis

</p>


</div>


</div>

)

}