import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { globalCss, G } from "./styles";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListingPage from "./pages/ListingPage";
import CreatePage from "./pages/CreatePage";
import BlogPage from "./pages/BlogPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";

function Layout() {
  const { pathname } = useLocation();
  const hideNav = pathname === "/admin" || pathname === "/auth";
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: G.bg, minHeight: "100vh", color: G.text }}>
      <style>{globalCss}</style>
      {!hideNav && <Nav />}
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<ListingPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
