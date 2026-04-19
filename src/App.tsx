import { AppRoutes } from "@/routes/AppRoutes";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: "var(--toast-bg)",
              color: "var(--text)",
              border: "1px solid var(--toast-border)",
              boxShadow: "var(--shadow-3d)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
