
import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUtensils
} from "react-icons/fa";

import "./Kontakt.scss";

const Kontakt = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    nachricht: ""
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post(
        "https://restaurant-langhaus-backend.onrender.com/api/contact",
        form
      );

      setStatus("success");

      setForm({
        name: "",
        email: "",
        nachricht: ""
      });
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            RESTAURANT LANGHAUS
          </span>

          <h1>Kontakt</h1>

          <div className="contact-title-line"></div>

          <p>
            Wir freuen uns, von Ihnen zu hören.
          </p>
        </div>
      </section>

      {/* KONTAKTINHALT */}
      <section className="contact-content">

        {/* LINKER BEREICH */}
        <div className="contact-info">

          <div className="contact-info-icon">
            <FaUtensils />
          </div>

          <span className="contact-small-title">
            WIR SIND FÜR SIE DA
          </span>

          <h2>
            Schreiben Sie uns
          </h2>

          <div className="contact-gold-line"></div>

          <p>
            Haben Sie Fragen, Wünsche oder spezielle Anliegen?
            Wir nehmen uns gerne Zeit für Ihr Anliegen.
          </p>

          <p>
            Nutzen Sie einfach unser Kontaktformular.
            Wir melden uns schnellstmöglich bei Ihnen.
          </p>

          <div className="contact-info-divider"></div>

          <div className="contact-restaurant-name">
            <FaMapMarkerAlt />
            <span>Restaurant Langhaus</span>
          </div>

          <span className="contact-address">
            Langhausstrasse 1<br />
            5400 Baden
          </span>

        </div>

        {/* RECHTER BEREICH */}
        <div className="contact-form-box">

          <div className="contact-form-heading">
            <span className="contact-small-title">
              IHRE NACHRICHT
            </span>

            <h2>Nachricht senden</h2>

            <p>
              Füllen Sie das Formular aus. Wir kümmern uns um Ihr Anliegen.
            </p>
          </div>

          {status === "success" && (
            <div className="contact-status success">
              <FaCheckCircle />
              Ihre Nachricht wurde erfolgreich gesendet.
            </div>
          )}

          {status === "error" && (
            <div className="contact-status error">
              Ihre Nachricht konnte leider nicht gesendet werden.
              Bitte versuchen Sie es später erneut.
            </div>
          )}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <label htmlFor="contact-name">Name</label>
            <div className="input-box">
              <FaUser />
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Ihr Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="contact-email">E-Mail-Adresse</label>
            <div className="input-box">
              <FaEnvelope />
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="Ihre E-Mail-Adresse"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="contact-message">Ihre Nachricht</label>
            <div className="input-box textarea">
              <FaCommentDots />
              <textarea
                id="contact-message"
                name="nachricht"
                placeholder="Wie können wir Ihnen weiterhelfen?"
                value={form.nachricht}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <button
              className="contact-submit"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading ? "Wird gesendet ..." : "Nachricht senden"}
              </span>
              <FaPaperPlane />
            </button>

            <p className="contact-form-note">
              Ihre Angaben werden ausschliesslich zur Bearbeitung
              Ihrer Anfrage verwendet.
            </p>

          </form>

        </div>

      </section>

    </main>
  );
};

export default Kontakt;
