export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex-grow h-screen">
        <div className="mx-2 lg:mx-0 transition-all duration-200 ease-in-out">

          <nav className="flex items-center justify-between py-2.5 px-6 rounded-lg sticky top-2 bg-zinc-300/40 backdrop-blur-md">
            <h1 className="text-xl italic font-serif">fachi</h1>
            <div className="flex items-center gap-1">
              <button className="text-sm border border-gray-200 py-1 px-3 rounded-md bg-white hover:bg-gray-100">
                Login
              </button>
              <button className="text-white text-sm py-1 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700">
                Sign Up
              </button>
            </div>
          </nav>

          <div className="py-10 flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-semibold text-center">Verify Claim Instantly with AI</h1>
              <p className="max-w-lg text-center leading-5 text-zinc-600">
                Fachi helps you separate fact from fiction. Our AI analyzes claims and provides evidence-based verdicts with trusted sources.
              </p>
            </div>

            <form className="w-full flex flex-col items-center justify-center mt-8 gap-2">
              <input 
                type="text"
                className="w-full max-w-xl border bg-white border-gray-200 rounded-xl py-2.5 px-4 text-[0.92rem] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Paste a claim or a URL here" 
                aria-label="Claim or URL input"
              />
              <button 
                type="submit"
                className="w-full max-w-xl bg-zinc-800 rounded-xl py-2 px-4 text-white cursor-pointer hover:bg-zinc-700"
              >
                Analyze
              </button>
            </form>
          </div>

        </div>
      </div>

      <footer className="mt-4">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} fachi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
