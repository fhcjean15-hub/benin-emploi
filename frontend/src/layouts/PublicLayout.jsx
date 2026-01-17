// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
