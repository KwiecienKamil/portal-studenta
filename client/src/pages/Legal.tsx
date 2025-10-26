import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../assets/logo_OT_t.png";

export const Legal = () => {
  return (
    <div className="fixed inset-0 bg-accent flex flex-col justify-center items-center z-50 p-4">
      <Link to="/">
        <img src={logo} className="max-w-[30%] mx-auto" alt="Ogarnij.to logo" />
      </Link>
      <Link
        to="/"
        className="group font-semibold flex items-center gap-2 duration-100 text-black text-2xl pb-4 hover:text-75 mt-8"
      >
        <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping mt-1" />
        Powrót do aplikacji
      </Link>
      <div className="bg-dark text-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
              („Ogarnijto.org”) oraz zasady przetwarzania danych osobowych
              użytkowników zgodnie z Rozporządzeniem Parlamentu Europejskiego i
              Rady (UE) 2016/679 (RODO).
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
              właściciel aplikacji: Kamil Kwiecień, e-mail:
              info@kamilkwiecien.tech.
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
                info@kamilkwiecien.tech
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
