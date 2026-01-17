import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Briefcase, FileText, Phone, BookOpen, Building2 } from "lucide-react";
import Logo from "../../assets/images/benin-emploi-plus-logo.jpg";

export default function Navbar() {
  const [openEntreprise, setOpenEntreprise] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  const user = JSON.parse(localStorage.getItem('user'));

  // Effet de scroll pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenEntreprise(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    if (prevLocationRef.current !== location.pathname) {
      prevLocationRef.current = location.pathname;
      // Utiliser setTimeout pour éviter setState synchrone
      const timer = setTimeout(() => {
        setMobileMenuOpen(false);
        setOpenEntreprise(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setOpenEntreprise(false);
  };

  const navLinks = [
    { to: "/offres-list", label: "Offres", icon: Briefcase, color: "green" },
    { to: "/formation-list", label: "Formations", icon: BookOpen, color: "amber" },
    { to: "/blog", label: "Blog", icon: FileText, color: "blue" },
    { to: "/contact", label: "Contact", icon: Phone, color: "purple" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo avec animation */}
            <Link
              to="/"
              className="flex items-center gap-3 group transition-transform hover:scale-105"
              onClick={handleLinkClick}
            >
              <img 
                src={Logo} 
                alt="Benin emploi+ Logo" 
                className="h-10 w-10 lg:h-12 lg:w-12 object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" 
              />
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Benin Emploi+
                </span>
                {/* <p className="text-xs text-gray-500 -mt-1">Votre avenir</p> */}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 group relative ${
                      active
                        ? `text-${link.color}-600 bg-${link.color}-50`
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {active && (
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-${link.color}-600 rounded-full`} />
                    )}
                  </Link>
                );
              })}

              {/* Dropdown Entreprises */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenEntreprise(!openEntreprise)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    openEntreprise || isActive("/presentation") || isActive("/depot-besoin")
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Entreprises
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openEntreprise ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu avec animation */}
                <div
                  className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top ${
                    openEntreprise
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }`}
                >
                  <Link
                    to="/presentation"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:text-red-700 transition-all group"
                    onClick={() => setOpenEntreprise(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Building2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Présentation</p>
                      <p className="text-xs text-gray-500">Découvrez Bénin Emploi+</p>
                    </div>
                  </Link>
                  <Link
                    to="/depot-besoin"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:text-red-700 transition-all group"
                    onClick={() => setOpenEntreprise(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dépôt de besoin</p>
                      <p className="text-xs text-gray-500">Soumettez votre besoin</p>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Auth Buttons Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {
                user?<span>{user.nom} {user.prenom}</span>:
                <Link
                to="/login"
                className="px-5 py-2.5 text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Connexion
              </Link>
              
              }
              
              <Link
                to={user? "dashboard/home":"/register"}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                {user?'Compte':'Inscription'}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                    active
                      ? `bg-${link.color}-50 text-${link.color}-700`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Entreprises Accordion */}
            <div className="mb-1">
              <button
                onClick={() => setOpenEntreprise(!openEntreprise)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  openEntreprise || isActive("/presentation") || isActive("/depot-besoin")
                    ? "bg-red-50 text-red-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Entreprises</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openEntreprise ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openEntreprise ? "max-h-40 mt-1" : "max-h-0"
                }`}
              >
                <Link
                  to="/presentation"
                  className="flex items-center gap-3 px-4 py-3 ml-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all"
                  onClick={handleLinkClick}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Présentation</span>
                </Link>
                <Link
                  to="/depot-besoin"
                  className="flex items-center gap-3 px-4 py-3 ml-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all"
                  onClick={handleLinkClick}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Dépôt de besoin</span>
                </Link>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                onClick={handleLinkClick}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium shadow-lg transition-all"
                onClick={handleLinkClick}
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer pour éviter que le contenu passe sous la navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}






// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Logo from "../../assets/images/logo.png"; // mettez votre logo ici

// export default function Navbar() {
//   const [openEntreprise, setOpenEntreprise] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-md fixed w-full z-50">
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center">
//           <img src={Logo} alt="GSB Logo" className="h-10 w-auto mr-2" />
//           <span className="text-xl font-bold text-green-600">GSB</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-6 relative">
//           <Link
//             to="/offres-list"
//             className="text-gray-700 hover:text-green-600 transition-colors font-medium"
//           >
//             Offres
//           </Link>
//           <Link
//             to="/formation-list"
//             className="text-gray-700 hover:text-yellow-600 transition-colors font-medium"
//           >
//             Formations
//           </Link>

//           {/* Dropdown Entreprises */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenEntreprise(!openEntreprise)}
//               className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
//             >
//               Entreprises
//               <span className="ml-1 text-sm">▾</span>
//             </button>

//             {openEntreprise && (
//               <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                 <Link
//                   to="/presentation"
//                   className="block px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//                   onClick={() => setOpenEntreprise(false)}
//                 >
//                   Présentation
//                 </Link>
//                 <Link
//                   to="/depot-besoin"
//                   className="block px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//                   onClick={() => setOpenEntreprise(false)}
//                 >
//                   Dépôt de besoin
//                 </Link>
//               </div>
//             )}
//           </div>

//           <Link
//             to="/blog"
//             className="text-gray-700 hover:text-yellow-600 transition-colors font-medium"
//           >
//             Blog
//           </Link>
//           <Link
//             to="/contact"
//             className="text-gray-700 hover:text-red-600 transition-colors font-medium"
//           >
//             Contact
//           </Link>
//         </nav>

//         {/* Auth Buttons Desktop */}
//         <div className="hidden md:flex gap-4">
//           <Link
//             to="/login"
//             className="text-gray-700 hover:text-green-600 transition-colors font-medium"
//           >
//             Connexion
//           </Link>
//           <Link
//             to="/register"
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
//           >
//             Inscription
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           {mobileMenuOpen ? "✕" : "☰"}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
//           <Link
//             to="/offres-list"
//             className="block px-6 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Offres
//           </Link>
//           <Link
//             to="/formation-list"
//             className="block px-6 py-3 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Formations
//           </Link>

//           {/* Mobile Entreprises Dropdown */}
//           <div>
//             <button
//               onClick={() => setOpenEntreprise(!openEntreprise)}
//               className="w-full text-left px-6 py-3 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors flex justify-between items-center"
//             >
//               Entreprises
//               <span>{openEntreprise ? "▴" : "▾"}</span>
//             </button>
//             {openEntreprise && (
//               <div className="pl-6">
//                 <Link
//                   to="/presentation"
//                   className="block px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Présentation
//                 </Link>
//                 <Link
//                   to="/depot-besoin"
//                   className="block px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Dépôt de besoin
//                 </Link>
//               </div>
//             )}
//           </div>

//           <Link
//             to="/blog"
//             className="block px-6 py-3 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Blog
//           </Link>
//           <Link
//             to="/contact"
//             className="block px-6 py-3 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Contact
//           </Link>

//           <Link
//             to="/login"
//             className="block px-6 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Connexion
//           </Link>
//           <Link
//             to="/register"
//             className="block px-6 py-3 bg-green-600 text-white rounded-md m-3 text-center hover:bg-green-700 transition-colors"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Inscription
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }
