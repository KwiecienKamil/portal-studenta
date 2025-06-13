import GoogleLoginBtn from "./components/GoogleLoginBtn";
import StripeCheckoutButton from "./components/StripeCheckoutButton";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-6">Google Login Demo</h1>
      <GoogleLoginBtn />
      <StripeCheckoutButton />
    </div>
  );
}

export default App;
