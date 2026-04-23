import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./styles/KUEvents.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
