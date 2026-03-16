import { Suspense, lazy } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage"));

function App() {
  return (
    <>
            <Router>
                <Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                    </Routes>
                </Suspense>
            </Router>
    </>

        );
}

export default App;