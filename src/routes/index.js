import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Private from "./private";

export default function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/register" element={<SignUp/>}/>

            <Route path="/dashboard" element={ <Private> <Dashboard/> </Private>}/>
            <Route path="/profile" element={ <Private> <Profile/> </Private>}/>
        </Routes>
    )
}