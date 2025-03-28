import logo from "/logo.svg";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 backdrop-blur-md">
      <img src={logo} alt="Logo" className="h-16 w-28" />
      <div className="mt-4 flex space-x-2">
        <span className="h-3 w-3 animate-pulse duration-300 rounded-full bg-slate-600"></span>
        <span className="h-3 w-3 animate-pulse duration-150 rounded-full bg-slate-600"></span>
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-600"></span>
      </div>
      <p className="relative top-60 text-xl font-semibold text-black">Datafloww</p>
    </div>
  );
};

export default Loading;
