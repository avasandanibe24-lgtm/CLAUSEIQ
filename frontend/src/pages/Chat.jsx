export default function Chat(){

return(

<div className="min-h-screen bg-gray-100 p-10">


<h1 className="text-4xl font-bold">
Agreement AI Assistant
</h1>


<div className="bg-white mt-8 p-6 rounded-xl shadow">

<p className="font-bold">
AI Assistant:
</p>

<p className="mt-2 text-gray-600">
The agreement contains a termination clause requiring a 60 day notice period.
</p>

</div>



<input

className="mt-6 border p-3 w-full rounded"

placeholder="Ask about your agreement..."

/>


<button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded">

Send

</button>


</div>

)

}