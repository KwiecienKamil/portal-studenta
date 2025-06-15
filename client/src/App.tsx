import { Link } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Wrapper>
      <Sidebar />
      <h1 className="text-3xl mb-6">Google Login Demo</h1>
      <Link to="/payment" className="mt-4">
        Upgrade your plan
      </Link>
    </Wrapper>
  );
}

export default App;
