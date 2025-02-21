import logo from "/logo.svg";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-md">
      <img src={logo} alt="Logo" className="h-16 w-28" />
      <div className="mt-4 flex space-x-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700 [animation-delay:-0.3s]"></span>
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700 [animation-delay:-0.15s]"></span>
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700"></span>
      </div>
      <p className="top-50 relative text-xl font-semibold text-black">Datafloww</p>
    </div>
  );
};

export default Loading;
