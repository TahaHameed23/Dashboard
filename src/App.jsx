import { Outlet } from "react-router-dom";
import Header from "./components/ui/Header";
function App() {
  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
    </>
  );
}

export default App;
