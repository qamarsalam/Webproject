import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { RegistrationProvider } from "./context/RegistrationContext";
import "./styles/KUEvents.css";

function App() {
  return (
    <AuthProvider>
      <RegistrationProvider>
        <AppRouter />
      </RegistrationProvider>
    </AuthProvider>
  );
}

export default App;
