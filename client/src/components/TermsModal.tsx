import React, { useState } from "react";

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-md max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Regulamin i Polityka Prywatności (RODO)
        </h2>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            1. Administrator danych
          </h3>
          <p>
            Administratorem Twoich danych osobowych jest właściciel aplikacji.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            2. Jakie dane zbieramy?
          </h3>
          <ul className="list-disc list-inside">
            <li>Imię i nazwisko</li>
            <li>Adres e-mail</li>
            <li>Identyfikator Google (google_id)</li>
            <li>
              Dane związane z płatnościami (przetwarzane przez zewnętrznego
              operatora, np. Stripe)
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            3. Cel przetwarzania danych
          </h3>
          <ul className="list-disc list-inside">
            <li>Umożliwienie korzystania z aplikacji</li>
            <li>Obsługa płatności i subskrypcji</li>
            <li>
              Komunikacja z użytkownikiem (np. zmiany w regulaminie, pomoc
              techniczna)
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">4. Podstawa prawna</h3>
          <ul className="list-disc list-inside">
            <li>Twoja zgoda (np. akceptacja regulaminu)</li>
            <li>Realizacja umowy (korzystanie z aplikacji)</li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            5. Przekazywanie danych
          </h3>
          <p>
            Dane mogą być udostępniane podmiotom współpracującym (np. Stripe,
            dostawcy hostingu).
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">6. Czas przechowywania</h3>
          <p>
            Dane przechowujemy do momentu realizacji usługi lub wycofania zgody.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-2">7. Twoje prawa</h3>
          <ul className="list-disc list-inside">
            <li>Dostęp do swoich danych</li>
            <li>Poprawianie danych</li>
            <li>Usunięcie danych („prawo do bycia zapomnianym”)</li>
            <li>Ograniczenie przetwarzania</li>
            <li>Sprzeciw wobec przetwarzania</li>
            <li>Przenoszenie danych</li>
            <li>Wycofanie zgody w dowolnym momencie</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">8. Kontakt</h3>
          <p>
            Masz pytania? Skontaktuj się z nami:{" "}
            <a
              href="mailto:kontakt@twojadomena.pl"
              className="text-blue-600 underline"
            >
              kontakt@twojadomena.pl
            </a>
            .
          </p>
        </section>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <label htmlFor="acceptTerms" className="select-none cursor-pointer">
            Akceptuję powyższy regulamin i politykę prywatności
          </label>
        </div>

        <button
          onClick={onAccept}
          disabled={!accepted}
          className={`w-full py-2 rounded text-white ${
            accepted
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Akceptuję regulamin
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
