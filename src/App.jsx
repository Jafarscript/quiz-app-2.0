/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from "react-router-dom";
import QuestionPage from "./components/QuestionPage";
import SurprisePage from "./components/SurprisePage";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";
import EachQuestion from "./components/EachQuestion";

const App = () => {
  return (
     <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/question/:id" element={<EachQuestion />} />
        <Route path="/surprise" element={<SurprisePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
     </>
  );
};

export default App;
