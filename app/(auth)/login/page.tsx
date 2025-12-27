import LoginForm from "../_components/LoginForm";

export default function page() {
  return (
    /* min-h-screen: makes the container at least as tall as the screen
       flex: enables flexbox
       items-center: centers vertically
       justify-center: centers horizontally
    */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f1218] px-4">
      {/* Background decoration (optional - for gaming aesthetic) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}