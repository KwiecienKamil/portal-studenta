import React, { useState } from "react";

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-dark text-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Regulamin i Polityka Prywatności
        </h2>

        <div className="mb-6 text-sm leading-relaxed space-y-4">
          <section>
            <h3 className="text-lg font-semibold mb-2">
              1. Postanowienia ogólne
            </h3>
            <p>
              Niniejszy regulamin określa zasady korzystania z aplikacji
              („Serwis”) oraz zasady przetwarzania danych osobowych użytkowników
              zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE)
              2016/679 (RODO).
            </p>
            <p>
              Korzystając z Serwisu, użytkownik akceptuje postanowienia
              regulaminu i wyraża zgodę na przetwarzanie swoich danych osobowych
              na warunkach opisanych w polityce prywatności.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              2. Administrator danych osobowych
            </h3>
            <p>
              Administratorem danych osobowych użytkowników Serwisu jest
              właściciel aplikacji: [Twoja firma lub imię i nazwisko], adres:
              [adres], e-mail: kontakt@twojadomena.pl.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              3. Zakres i cel przetwarzania danych
            </h3>
            <p>Dane osobowe użytkowników przetwarzane są w celu:</p>
            <ul className="list-disc list-inside">
              <li>realizacji usług świadczonych przez Serwis,</li>
              <li>obsługi płatności i subskrypcji (jeśli dotyczy),</li>
              <li>
                kontaktowania się z użytkownikiem w sprawach związanych z
                korzystaniem z Serwisu,
              </li>
              <li>spełnienia wymogów prawnych.</li>
            </ul>
            <p>
              Zakres przetwarzanych danych obejmuje m.in. imię i nazwisko, adres
              e-mail, identyfikatory (np. Google ID), dane płatnicze
              przetwarzane przez zewnętrznych operatorów (np. Stripe).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              4. Podstawa prawna przetwarzania
            </h3>
            <p>Dane przetwarzane są na podstawie:</p>
            <ul className="list-disc list-inside">
              <li>zgody użytkownika (art. 6 ust. 1 lit. a RODO),</li>
              <li>
                realizacji umowy lub podjętych działań na żądanie użytkownika
                (art. 6 ust. 1 lit. b RODO),
              </li>
              <li>
                wypełnienia obowiązków prawnych ciążących na administratorze
                (art. 6 ust. 1 lit. c RODO).
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              5. Udostępnianie danych
            </h3>
            <p>
              Dane użytkowników mogą być udostępniane wyłącznie podmiotom
              współpracującym, takim jak operatorzy płatności, dostawcy hostingu
              czy firmy świadczące usługi techniczne, wyłącznie w zakresie
              niezbędnym do realizacji celów Serwisu.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              6. Okres przechowywania danych
            </h3>
            <p>
              Dane przechowywane są przez okres niezbędny do realizacji usług
              lub do momentu wycofania zgody przez użytkownika, z zachowaniem
              wymogów wynikających z przepisów prawa.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">7. Prawa użytkownika</h3>
            <p>Użytkownik ma prawo do:</p>
            <ul className="list-disc list-inside">
              <li>dostępu do swoich danych,</li>
              <li>poprawiania danych,</li>
              <li>usunięcia danych („prawo do bycia zapomnianym”),</li>
              <li>ograniczenia przetwarzania,</li>
              <li>sprzeciwu wobec przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>
                wycofania zgody w dowolnym momencie, bez wpływu na zgodność
                przetwarzania dokonanego przed wycofaniem zgody,
              </li>
              <li>
                wniesienia skargi do organu nadzorczego (w Polsce: Urząd Ochrony
                Danych Osobowych).
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              8. Bezpieczeństwo danych
            </h3>
            <p>
              Administrator stosuje odpowiednie środki techniczne i
              organizacyjne zapewniające ochronę danych osobowych przed
              nieuprawnionym dostępem, utratą lub nieuprawnioną modyfikacją.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              9. Pliki cookies i technologie podobne
            </h3>
            <p>
              Serwis może korzystać z plików cookies i innych technologii
              śledzących w celu poprawy jakości usług, analizy ruchu i
              personalizacji treści. Użytkownik może zarządzać ustawieniami
              cookies w swojej przeglądarce.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              10. Zmiany w regulaminie i polityce prywatności
            </h3>
            <p>
              Administrator zastrzega sobie prawo do wprowadzania zmian w
              regulaminie i polityce prywatności. O wszelkich zmianach
              użytkownicy zostaną poinformowani w odpowiedni sposób.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">11. Kontakt</h3>
            <p>
              W przypadku pytań dotyczących regulaminu lub przetwarzania danych
              prosimy o kontakt pod adresem:{" "}
              <a href="mailto:kontakt@twojadomena.pl" className="underline">
                kontakt@twojadomena.pl
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <label htmlFor="acceptTerms" className="select-none cursor-pointer">
            Akceptuję regulamin i politykę prywatności
          </label>
        </div>

        <button
          onClick={onAccept}
          disabled={!accepted}
          className={`w-full py-2 rounded text-dark font-medium cursor-pointer transition duration-300 ${
            accepted
              ? "bg-white hover:bg-accent"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Akceptuję
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
