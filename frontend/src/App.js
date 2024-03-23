import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./MainScreen";
import { GoogleOAuthProvider } from '@react-oauth/google';


export default function App() {
  return (
    <GoogleOAuthProvider clientId="**">
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} /> {/* 👈 Renders at /app/ */}
          <Route path="/" Component={Home} /> {/* 👈 Renders at /app/ */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}