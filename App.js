import AppRouter from "./src/router/AppRouter";
import { AuthProvider } from "./src/context/AuthContext";
import { RegistrationProvider } from "./src/context/RegistrationContext";
import "./src/styles/KUEvents.css";

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
