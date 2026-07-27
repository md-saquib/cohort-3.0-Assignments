import Navbar from "./components/Navbar/Navbar";
import RoutePanel from "./routes/RoutePanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <Navbar />
      <RoutePanel />

      <ToastContainer />



    </>
  )
}

export default App
