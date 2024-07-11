import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./components/Layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/context/AuthContext/AuthContext";
import { FeedProvider } from "./components/context/FeedContext/FeedContext";
import { SearchProvider } from "./components/context/SearchUserContext/SearchUserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SearchProvider>
        <FeedProvider>
          <Layout>
            <App />
          </Layout>
        </FeedProvider>
        </SearchProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
