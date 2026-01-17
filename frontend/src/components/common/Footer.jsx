import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Briefcase,
  BookOpen,
  Building2,
  FileText,
  Heart
} from "lucide-react";
import Logo from "../../assets/images/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { to: "/offres-list", label: "Offres d'emploi", icon: Briefcase },
      { to: "/formation-list", label: "Formations", icon: BookOpen },
      { to: "/presentation", label: "Entreprises", icon: Building2 },
      { to: "/blog", label: "Blog & Actualités", icon: FileText },
    ],
    entreprise: [
      { to: "/presentation", label: "À propos de nous" },
      { to: "/depot-besoin", label: "Déposer une offre" },
      { to: "/contact", label: "Nous contacter" },
      { to: "/cgv", label: "CGV" },
    ],
    legal: [
      { to: "/mentions-legales", label: "Mentions légales" },
      { to: "/politique-confidentialite", label: "Confidentialité" },
      { to: "/cookies", label: "Cookies" },
      { to: "/plan-site", label: "Plan du site" },
    ],
  };

  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook", color: "hover:bg-blue-600" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter", color: "hover:bg-sky-500" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram", color: "hover:bg-pink-600" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Colonne 1 : À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={Logo} 
                alt="GSB Logo" 
                className="h-12 w-12 object-contain rounded-xl shadow-lg" 
              />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Benin Emploi+
                </h3>
                {/* <p className="text-xs text-gray-400">Bénin Emploi</p> */}
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre plateforme de référence pour trouver un emploi, se former et développer sa carrière au Bénin.
            </p>
            
            {/* Coordonnées */}
            <div className="space-y-2 pt-2">
              <a 
                href="mailto:contact@gsbbenin.com" 
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>contact@beninemploi.com</span>
              </a>
              <a 
                href="tel:+22912345678" 
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>+229 12 34 56 78</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Cotonou, Bénin</span>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Nos Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Nos Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Colonne 3 : Entreprise */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-green-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Informations Légales */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Informations</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-green-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-3">Newsletter</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all text-sm"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-800"></div>

      {/* Section inférieure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} <span className="text-green-400 font-semibold">Bénin Emploi</span>. 
            Tous droits réservés. Fait avec <Heart className="w-3 h-3 inline text-red-500 fill-red-500" /> au Bénin
          </p>

          {/* Réseaux sociaux */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:text-white transition-all hover:scale-110 ${social.color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}