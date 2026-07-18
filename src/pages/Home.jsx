import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar Component */}
      <div className="navbar bg-base-100 shadow-sm z-10 px-6">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl normal-case">
            <span className="text-primary text-2xl">♞</span> LICHESS.TRACK
          </a>
        </div>
        <div className="flex-none text-xs text-base-content/50 font-medium">
          Powered by Lichess API
        </div>
      </div>

      {/* Hero Component (Main Content) */}
      <main className="hero flex-1 bg-base-200">
        <div className="hero-content text-center px-4">
          <div className="max-w-xl">
            {/* Graphic element */}
            <div className="text-6xl mb-6 text-primary/80 animate-bounce">
              ♔
            </div>

            {/* Typography */}
            <h1 className="text-5xl font-bold mb-4">
              Analyze Your{" "}
              <span className="text-primary">Chess Performance</span>
            </h1>
            <p className="py-6 text-lg text-base-content/80">
              Instantly view ratings, game milestones, win ratios, and
              performance trends for any player on Lichess.
            </p>

            {/* Search Bar */}
            <SearchBar />
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="footer footer-center p-6 bg-base-300 text-base-content">
        <aside>
          <p>
            &copy; {new Date().getFullYear()} Lichess User Stat Tracker. Built
            with React, Vite & DaisyUI.
          </p>
        </aside>
      </footer>
    </div>
  );
}
