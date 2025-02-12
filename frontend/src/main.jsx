import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor} >
        <Toaster />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
