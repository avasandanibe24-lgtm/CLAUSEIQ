import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Chat from "./pages/Chat";


function App(){

return(

<BrowserRouter>

<Routes>


<Route 
path="/" 
element={<Home/>}
/>


<Route 
path="/login" 
element={<Login/>}
/>


<Route 
path="/dashboard" 
element={<Dashboard/>}
/>


<Route 
path="/upload" 
element={<Upload/>}
/>


<Route 
path="/analysis" 
element={<Analysis/>}
/>


<Route 
path="/chat" 
element={<Chat/>}
/>


</Routes>


</BrowserRouter>

)

}


export default App;