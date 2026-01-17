// src/pages/public/Contact.jsx
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Contact() {
  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Contactez <span className="text-yellow-300">Bénin Emploi+</span>
          </h1>
          <p className="max-w-2xl mx-auto text-green-100 text-lg">
            Une question, un besoin spécifique ou un partenariat ?
            Notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ===== Infos + WhatsApp ===== */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Coordonnées
            </h2>
            <p className="text-gray-600">
              Vous pouvez nous contacter directement ou nous laisser un message
              via le formulaire.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-green-600" />
              <span className="text-gray-700">contact@beninemploi.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-green-600" />
              <span className="text-gray-700">+229 90 00 00 00</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-green-600" />
              <span className="text-gray-700">
                Cotonou, Bénin
              </span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/22990000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition"
          >
            <MessageCircle />
            Discuter sur WhatsApp
          </a>
        </div>

        {/* ===== Formulaire ===== */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Envoyez-nous un message
          </h3>

          <form className="space-y-5">
            <Input label="Nom complet" placeholder="Votre nom" />
            <Input label="Email" type="email" placeholder="Votre email" />
            <Input label="Sujet" placeholder="Objet du message" />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="5"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Votre message..."
              />
            </div>

            <Button variant="primary" className="w-full">
              Envoyer le message
            </Button>
          </form>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="h-[450px] w-full">
        <iframe
          title="Carte Bénin Emploi+"
          src="https://www.google.com/maps?q=Cotonou,Benin&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Prêt à collaborer avec nous ?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Que vous soyez une entreprise, un candidat ou un centre de formation,
            Bénin Emploi+ vous accompagne.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/depot-besoin"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-medium transition"
            >
              Je suis une entreprise
            </a>
            <a
              href="/register"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-medium transition"
            >
              Je suis candidat
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
