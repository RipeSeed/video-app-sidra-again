import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/Homepage";
import Authentication from "./components/Authentication";
import PrivateRoute from "./PrivateRoute";
import firbaseApp from "./base";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    onAuthStateChanged(firbaseApp.auth(), (_user) => {
      if (_user) {
        setUser(_user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute isSignedIn={user ? true : false} />}>
          <Route path="/" element={<HomePage user={user} />} />
        </Route>
        <Route
          path="/login"
          element={<Authentication auth={firbaseApp.auth()} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
