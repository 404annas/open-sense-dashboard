
import "./App.css"
import AppRoutes from "./routes"
import { ToastContainer } from "react-toastify"
import Modal from 'react-modal';

Modal.setAppElement('#root');
function App() {

  return (<>
    <ToastContainer className={"z-999"} />
    <AppRoutes />
  </>

  )
}

export default App
