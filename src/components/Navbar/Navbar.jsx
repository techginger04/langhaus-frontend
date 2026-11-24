
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHome,
  faSignInAlt,
  faSignOutAlt,
  faBars,
  faBook,
  faImage,
  faCalendarCheck,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "./Navbar.scss";

const API = "https://restaurant-langhaus-backend.onrender.com/api";

function Navbar() {
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [angebotOpen, setAngebotOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  // Login-Status prüfen
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  // Logo laden
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${API}/logo`);
        setLogoUrl(response.data.logoUrl || null);
      } catch (error) {
        console.error("Logo konnte nicht geladen werden", error);
      }
    };

    fetchLogo();
  }, []);

  // Speisekarten laden
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${API}/menu/cards`);
        setCards(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Speisekarten konnten nicht geladen werden", error);
      }
    };

    fetchCards();
  }, []);

  // Navigation schliessen
  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".navbar")) {
        setBurgerMenuActive(false);
        setAngebotOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const closeNavigation = () => {
    setBurgerMenuActive(false);
    setAngebotOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    closeNavigation();

    navigate("/login");
  };

  return (
    <nav className={`navbar ${burgerMenuActive ? "open" : ""}`}>
      <div className="navbar-container">

        {/* LOGO */}
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeNavigation}>
            {logoUrl ? (
              <img src={logoUrl} alt="Restaurant Langhaus Logo" />
            ) : (
              <span>LANGHAUS</span>
            )}
          </NavLink>
        </div>

        {/* BURGER */}
        <button
          className="burger-button"
          onClick={(e) => {
            e.stopPropagation();
            setBurgerMenuActive(!burgerMenuActive);
          }}
          aria-label="Navigation öffnen"
          aria-expanded={burgerMenuActive}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* NAVIGATION */}
        <ul className={`navbar-links ${burgerMenuActive ? "active" : ""}`}>

          <NavbarItem
            to="/"
            text="Home"
            icon={faHome}
            close={closeNavigation}
          />

          {/* RESERVATION */}
          <li>
            <a
              href="https://www.lunchgate.ch/restaurant/langhaus/"
              className="navbar-link reservation-link"
              onClick={closeNavigation}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span>Reservation</span>
            </a>
          </li>

          {/* ANGEBOT */}
          <li className={`navbar-dropdown ${angebotOpen ? "dropdown-open" : ""}`}>

            <button
              className="navbar-link dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setAngebotOpen(!angebotOpen);
              }}
              aria-expanded={angebotOpen}
            >
              <FontAwesomeIcon icon={faBook} />
              <span>Angebot</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="dropdown-arrow"
              />
            </button>

            <ul className="dropdown-menu">

              <li>
                <NavLink
                  to="/cards"
                  className="dropdown-link"
                  onClick={closeNavigation}
                >
                  Alle Karten
                </NavLink>
              </li>

              {cards.map((card) => (
                <li key={card.id}>
                  <NavLink
                    to={`/cards/${card.id}`}
                    className="dropdown-link"
                    onClick={closeNavigation}
                  >
                    {card.name}
                  </NavLink>
                </li>
              ))}

              {cards.length === 0 && (
                <li className="dropdown-empty">
                  Keine Karten vorhanden
                </li>
              )}

            </ul>
          </li>

          <NavbarItem
            to="/galerie"
            text="Galerie"
            icon={faImage}
            close={closeNavigation}
          />

          {!isLoggedIn ? (
            <NavbarItem
              to="/login"
              text="Login"
              icon={faSignInAlt}
              close={closeNavigation}
            />
          ) : (
            <li>
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

function NavbarItem({ to, text, icon, close }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `navbar-link ${isActive ? "active" : ""}`
        }
        onClick={close}
      >
        <FontAwesomeIcon icon={icon} />
        <span>{text}</span>
      </NavLink>
    </li>
  );
}

export default Navbar;
