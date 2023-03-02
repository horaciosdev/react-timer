import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Timer from "./components/Timer";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Timer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
