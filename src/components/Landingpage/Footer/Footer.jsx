
import React from "react";
import { Link } from "react-router-dom";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaTripadvisor,
  FaArrowUp,
  FaUtensils,
  FaChevronRight,
  FaCar,
} from "react-icons/fa";

import "./Footer.scss";

function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* GOLDENE AKZENTLINIE */}
      <div className="footer-top-line"></div>

      <div className="footer-wrapper">

        {/* RESTAURANT INFO */}
        <div className="footer-column about">

          <div className="footer-logo">

            <div className="logo-circle">
              <FaUtensils />
            </div>

            <div className="footer-brand">
              <h2>Restaurant Langhaus</h2>
              <span>Tradition · Genuss · Gastfreundschaft</span>
            </div>

          </div>

          <p className="footer-description">
            Willkommen im Restaurant Langhaus.
            Wir verwöhnen unsere Gäste mit frischen,
            saisonalen Gerichten, regionalen Zutaten
            und einer grossen Auswahl an erlesenen
            Weinen.
          </p>

          <div className="footer-social">

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tripadvisor.ch/Restaurant_Review-g198855-d19769579-Reviews-Restaurant_Langhaus-Baden_Canton_of_Aargau.html"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tripadvisor"
            >
              <FaTripadvisor />
            </a>

          </div>

        </div>

        {/* KONTAKT */}
        <div className="footer-column">

          <h3>Kontakt</h3>

          <div className="footer-heading-line"></div>

          <div className="footer-contact">

            <div className="contact-item">
              <FaMapMarkerAlt />

              <div>
                <strong>Adresse</strong>
                <span>
                  Langhausstrasse 1
                  <br />
                  5400 Baden
                </span>
              </div>
            </div>

            <div className="contact-item">
              <FaPhoneAlt />

              <div>
                <strong>Telefon</strong>
                <a href="tel:+41565552112">
                  +41 56 555 21 12
                </a>
              </div>
            </div>

            <div className="contact-item">
              <FaEnvelope />

              <div>
                <strong>E-Mail</strong>
                <a href="mailto:gastro@baden-langhaus.ch">
                  gastro@baden-langhaus.ch
                </a>
              </div>
            </div>

          </div>

          <div className="footer-buttons">

            <a
              href="tel:+41565552112"
              className="gold-btn"
            >
              <FaPhoneAlt />
              Jetzt anrufen
            </a>

            <Link
              to="/kontakt"
              className="outline-btn"
            >
              Kontakt aufnehmen
            </Link>

          </div>

        </div>

        {/* ÖFFNUNGSZEITEN */}
        <div className="footer-column">

          <h3>Öffnungszeiten</h3>

          <div className="footer-heading-line"></div>

          <div className="opening-card">

            <div className="opening-title">
              <FaClock />
              <span>Restaurant</span>
            </div>

            <div className="opening-row">
              <span>Mo – Fr</span>
              <strong>
                11:00 – 14:00
                <br />
                17:00 – 23:00
              </strong>
            </div>

            <div className="opening-row">
              <span>Samstag</span>
              <strong>17:00 – 23:00</strong>
            </div>

            <div className="opening-row closed">
              <span>Sonntag</span>
              <strong>Geschlossen</strong>
            </div>

            <div className="opening-separator"></div>

            <div className="opening-title kitchen">
              <FaUtensils />
              <span>Küche</span>
            </div>

            <div className="opening-row">
              <span>Mo – Fr</span>
              <strong>
                11:30 – 14:00
                <br />
                17:00 – 22:00
              </strong>
            </div>

            <div className="opening-row">
              <span>Samstag</span>
              <strong>17:00 – 22:00</strong>
            </div>

            <div className="opening-row closed">
              <span>Sonntag</span>
              <strong>Geschlossen</strong>
            </div>

          </div>

        </div>

        {/* SERVICE */}
        <div className="footer-column">

          <h3>Service</h3>

          <div className="footer-heading-line"></div>

          <ul className="footer-links">

            <li>
              <FaChevronRight />
              <Link to="/">Home</Link>
            </li>

            <li>
              <FaChevronRight />
              <Link to="/cards">Speisekarten</Link>
            </li>

            <li>
              <FaChevronRight />
              <a
                href="https://www.lunchgate.ch/restaurant/langhaus/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reservation
              </a>
            </li>

            <li>
              <FaChevronRight />
              <Link to="/events">Events</Link>
            </li>

            <li>
              <FaChevronRight />
              <Link to="/galerie">Galerie</Link>
            </li>

            <li>
              <FaChevronRight />
              <Link to="/kontakt">Kontakt</Link>
            </li>

          </ul>

          <div className="route-box">

            <FaCar />

            <div>
              <strong>Anfahrt</strong>

              <p>
                Kostenlose Parkplätze direkt
                vor dem Restaurant.
              </p>
            </div>

          </div>

          <a
            className="gold-btn full"
            href="https://www.google.com/maps/search/?api=1&query=Langhausstrasse+1%2C+5400+Baden"
            target="_blank"
            rel="noopener noreferrer"
          >
            Route planen
          </a>

        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">

        <div className="footer-bottom-left">
          <span>© {year} Restaurant Langhaus</span>
          <span className="copyright-divider">|</span>
          <span>Alle Rechte vorbehalten.</span>
        </div>

        <div className="footer-bottom-center">

          <Link to="/impressum">
            Impressum
          </Link>

          <Link to="/datenschutz">
            Datenschutz
          </Link>

          <Link to="/agb">
            AGB
          </Link>

        </div>

        <button
          className="scroll-top"
          onClick={scrollTop}
          aria-label="Nach oben scrollen"
          title="Nach oben"
        >
          <FaArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;
