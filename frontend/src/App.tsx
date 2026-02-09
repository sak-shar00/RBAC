import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store, type RootState } from "./store";
import AppRoutes from "./routes/AppRoutes";
import Spinner from "./components/Spinner";

function AppContent() {
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    // App mounted
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
