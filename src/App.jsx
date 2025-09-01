import "./css/App.css";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { MovieProvider } from "./contexts/MovieContext";

function App() {
  return (
    <>
      <MovieProvider>
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </MovieProvider>
    </>
  );
}

export default App;
