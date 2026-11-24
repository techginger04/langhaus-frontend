
import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import {
  FaTrash,
  FaEdit,
  FaSave,
  FaPlus,
  FaUtensils,
  FaClock,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import "./Home.scss";

const API =
  "https://restaurant-langhaus-backend.onrender.com/api";

const GALERIE_API = `${API}/galerie`;

const WOCHENTAGE = [
  "Mo",
  "Di",
  "Mi",
  "Do",
  "Fr",
  "Sa",
  "So"
];

const Home = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin =
    user?.userTypes?.includes("admin");

  const [homeContent, setHomeContent] = useState(null);
  const [oeffnungszeiten, setOeffnungszeiten] = useState([]);
  const [editTimes, setEditTimes] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [bilder, setBilder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ferienPopup, setFerienPopup] = useState(null);
  const [saving, setSaving] = useState(false);

  /*
  ===================================
      DATEN LADEN
  ===================================
  */

  const fetchHomeContent = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/home`);
      setHomeContent(res.data);
    } catch (err) {
      console.error("Fehler beim Laden des Home-Inhalts:", err);
    }
  }, []);

  const fetchOeffnungszeiten = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/oeffnungszeiten`);
      setOeffnungszeiten(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Öffnungszeiten:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGalerie = useCallback(async () => {
    try {
      const res = await axios.get(GALERIE_API);
      setBilder(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Galerie:", err);
    }
  }, []);

  const fetchBetriebsferien = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/betriebsferien/active`);

      if (res.data.active && res.data.ferien?.length > 0) {
        setFerienPopup(res.data.ferien[0]);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Betriebsferien:", err);
    }
  }, []);

  useEffect(() => {
    fetchHomeContent();
    fetchOeffnungszeiten();
    fetchGalerie();
    fetchBetriebsferien();
  }, [
    fetchHomeContent,
    fetchOeffnungszeiten,
    fetchGalerie,
    fetchBetriebsferien
  ]);

  /*
  ===================================
      ÖFFNUNGSZEITEN ADMIN
  ===================================
  */

  const fetchOeffzeitenForEdit = async (catKey) => {
    try {
      const res = await axios.get(
        `${API}/oeffnungszeiten/edit`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditTimes({
        [catKey]: res.data[catKey] || []
      });

      setEditingCategory(catKey);
    } catch (err) {
      console.error("Fehler beim Laden der Bearbeitungsdaten:", err);
    }
  };

  const handleAddTime = (catKey) => {
    const newEntry = {
      id: `new-${Date.now()}`,
      wochentag: "Mo",
      von: "09:00",
      bis: "18:00",
      isNew: true
    };

    setEditTimes(prev => ({
      ...prev,
      [catKey]: [
        ...(prev[catKey] || []),
        newEntry
      ]
    }));
  };

  const handleEditTime = (catKey, id, field, value) => {
    setEditTimes(prev => ({
      ...prev,
      [catKey]: (prev[catKey] || []).map(e =>
        e.id === id
          ? { ...e, [field]: value }
          : e
      )
    }));
  };

  const handleDelete = async (id) => {
    if (String(id).startsWith("new-")) {
      setEditTimes(prev => ({
        ...prev,
        [editingCategory]: (prev[editingCategory] || []).filter(
          item => item.id !== id
        )
      }));
      return;
    }

    try {
      await axios.delete(
        `${API}/oeffnungszeiten/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchOeffzeitenForEdit(editingCategory);
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
    }
  };

  const handleSaveCategory = async (catKey) => {
    setSaving(true);

    try {
      for (const item of editTimes[catKey] || []) {
        const payload = {
          wochentag: item.wochentag,
          von: item.von,
          bis: item.bis,
          kategorie:
            catKey === "__DEFAULT__"
              ? null
              : catKey
        };

        if (item.isNew) {
          await axios.post(
            `${API}/oeffnungszeiten`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } else {
          await axios.put(
            `${API}/oeffnungszeiten/${item.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }
      }

      setEditingCategory(null);
      await fetchOeffnungszeiten();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    } finally {
      setSaving(false);
    }
  };

  /*
  ===================================
      GALERIE LIGHTBOX
  ===================================
  */

  const closeFullscreen = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const nextBild = useCallback(() => {
    setActiveIndex(i =>
      i === null || bilder.length === 0
        ? null
        : (i + 1) % bilder.length
    );
  }, [bilder.length]);

  const prevBild = useCallback(() => {
    setActiveIndex(i =>
      i === null || bilder.length === 0
        ? null
        : (i - 1 + bilder.length) % bilder.length
    );
  }, [bilder.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowRight") nextBild();
      if (e.key === "ArrowLeft") prevBild();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, closeFullscreen, nextBild, prevBild]);

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= bilder.length) {
      setActiveIndex(
        bilder.length > 0 ? bilder.length - 1 : null
      );
    }
  }, [activeIndex, bilder.length]);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <span>Restaurant Langhaus</span>
      </div>
    );
  }

  /*
  ===================================
          RENDER
  ===================================
  */

  return (
    <main className="home-container">

      {/* BETRIEBSFERIEN */}

      {ferienPopup && (
        <div className="ferien-popup">
          <div className="popup-box">

            <button
              className="popup-close"
              onClick={() => setFerienPopup(null)}
              aria-label="Schliessen"
            >
              <FaTimes />
            </button>

            <span className="popup-eyebrow">
              RESTAURANT LANGHAUS
            </span>

            <div className="popup-icon">
              <FaClock />
            </div>

            <h2>Betriebsferien</h2>

            <div className="popup-gold-line"></div>

            <p>
              Unser Restaurant bleibt vom
            </p>

            <strong>{ferienPopup.von}</strong>

            <span className="popup-bis">bis</span>

            <strong>{ferienPopup.bis}</strong>

            {ferienPopup.beschreibung && (
              <p className="popup-description">
                {ferienPopup.beschreibung}
              </p>
            )}

            <button
              className="popup-button"
              onClick={() => setFerienPopup(null)}
            >
              Verstanden
            </button>

          </div>
        </div>
      )}

      {/* HERO */}

      {homeContent && (
        <section
          className="premium-hero"
          style={{
            backgroundImage: `url(${homeContent.bild || ""})`
          }}
        >
          <div className="hero-overlay">
            <div className="hero-content">

              <span className="hero-eyebrow">
                WILLKOMMEN IM RESTAURANT LANGHAUS
              </span>

              <div className="hero-gold-line"></div>

              <h1>
                {homeContent.willkommenText}
              </h1>

              <p>
                Genuss. Gastfreundschaft. Langhaus.
              </p>

              <a
                href="https://www.lunchgate.ch/restaurant/langhaus/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button"
              >
                Tisch reservieren
              </a>

            </div>
          </div>
        </section>
      )}

      {/* WILLKOMMEN */}

      <section className="home-intro">
        <span className="section-eyebrow">
          RESTAURANT LANGHAUS
        </span>

        <h2>
          Schön, dass Sie da sind.
        </h2>

        <div className="section-gold-line"></div>

        <p>
          Wir heissen Sie herzlich willkommen und freuen uns,
          Sie bei uns begrüssen zu dürfen.
        </p>
      </section>

      {/* ÖFFNUNGSZEITEN */}

      <section className="oeffnungszeiten-section">

        <div className="section-header">
          <span className="section-eyebrow">
            WIR FREUEN UNS AUF SIE
          </span>

          <h2>Öffnungszeiten</h2>

          <div className="section-gold-line"></div>

          <p>
            Besuchen Sie uns und geniessen Sie eine angenehme Zeit
            im Restaurant Langhaus.
          </p>
        </div>

        <div className="opening-grid">

          {oeffnungszeiten.map((cat, idx) => {
            const catKey = cat.kategorie ?? "__DEFAULT__";
            const isEditing = editingCategory === catKey;

            const entries = isEditing
              ? editTimes[catKey] || []
              : cat.eintraege || [];

            return (
              <div
                key={cat.kategorie ?? `category-${idx}`}
                className="category-block"
              >

                {!isEditing && (
                  <>
                    <div className="opening-card-icon">
                      <FaClock />
                    </div>

                    <h3>
                      {cat.kategorie ?? "Restaurant"}
                    </h3>

                    <div className="opening-card-line"></div>

                    <div className="times-list">
                      {entries.map((e, i) =>
                        (e.wochentage || []).map((d, j) => (
                          <div
                            key={`${i}-${j}`}
                            className="time-item"
                          >
                            <span>{d}</span>

                            <span>
                              {e.geschlossen
                                ? "Geschlossen"
                                : (e.zeiten || []).join(", ")}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {isEditing && (
                  <div className="edit-times">
                    <h3>
                      {cat.kategorie ?? "Restaurant"} bearbeiten
                    </h3>

                    {entries.map(e => (
                      <div
                        key={e.id}
                        className="edit-row"
                      >
                        <select
                          value={e.wochentag}
                          onChange={ev =>
                            handleEditTime(
                              catKey,
                              e.id,
                              "wochentag",
                              ev.target.value
                            )
                          }
                        >
                          {WOCHENTAGE.map(d => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        <input
                          type="time"
                          value={e.von}
                          onChange={ev =>
                            handleEditTime(
                              catKey,
                              e.id,
                              "von",
                              ev.target.value
                            )
                          }
                        />

                        <input
                          type="time"
                          value={e.bis}
                          onChange={ev =>
                            handleEditTime(
                              catKey,
                              e.id,
                              "bis",
                              ev.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="delete-time"
                          onClick={() => handleDelete(e.id)}
                          aria-label="Eintrag löschen"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}

                    <div className="edit-actions">
                      <button
                        type="button"
                        onClick={() => handleAddTime(catKey)}
                      >
                        <FaPlus />
                        Hinzufügen
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCategory(catKey)}
                        disabled={saving}
                      >
                        <FaSave />
                        {saving ? "Speichert ..." : "Speichern"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}

                {isAdmin && !isEditing && (
                  <button
                    className="edit-button"
                    onClick={() => fetchOeffzeitenForEdit(catKey)}
                  >
                    <FaEdit />
                    Bearbeiten
                  </button>
                )}

              </div>
            );
          })}

        </div>
      </section>

      {/* GALERIE */}

      <section className="galerie-section">

        <div className="section-header">
          <span className="section-eyebrow">
            EINBLICKE
          </span>

          <h2>Einblicke ins Langhaus</h2>

          <div className="section-gold-line"></div>

          <p>
            Entdecken Sie die Atmosphäre unseres Restaurants.
          </p>
        </div>

        <div className="gallery-grid">
          {bilder.slice(0, 6).map((b, i) => (
            <div
              key={b.id}
              className="gallery-card"
              onClick={() => setActiveIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(i);
                }
              }}
            >
              <img
                src={b.bild}
                alt="Einblick ins Restaurant Langhaus"
                loading="lazy"
              />

              <div className="gallery-card-overlay">
                <span>Bild ansehen</span>
              </div>
            </div>
          ))}
        </div>

        {bilder.length > 6 && (
          <div className="gallery-more">
            <a href="/galerie">
              Gesamte Galerie ansehen
              <FaChevronRight />
            </a>
          </div>
        )}

        {activeIndex !== null && bilder[activeIndex] && (
          <div
            className="lightbox"
            onClick={closeFullscreen}
          >
            <div
              className="lightbox-content"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="close"
                onClick={closeFullscreen}
                aria-label="Schliessen"
              >
                <FaTimes />
              </button>

              <button
                className="lightbox-arrow lightbox-prev"
                onClick={prevBild}
                aria-label="Vorheriges Bild"
              >
                <FaChevronLeft />
              </button>

              <img
                src={bilder[activeIndex].bild}
                alt="Restaurant Langhaus"
              />

              <button
                className="lightbox-arrow lightbox-next"
                onClick={nextBild}
                aria-label="Nächstes Bild"
              >
                <FaChevronRight />
              </button>

              <div className="lightbox-counter">
                {activeIndex + 1} / {bilder.length}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* RESERVATION */}

      <section className="home-reservation">
        <div className="reservation-content">
          <FaUtensils className="reservation-icon" />

          <span className="section-eyebrow">
            RESTAURANT LANGHAUS
          </span>

          <h2>Wir freuen uns auf Ihren Besuch.</h2>

          <div className="section-gold-line"></div>

          <p>
            Reservieren Sie Ihren Tisch und verbringen Sie
            eine schöne Zeit bei uns.
          </p>

          <a
            href="https://www.lunchgate.ch/restaurant/langhaus/"
            target="_blank"
            rel="noopener noreferrer"
            className="reservation-button"
          >
            Jetzt Tisch reservieren
          </a>
        </div>
      </section>

    </main>
  );
};

export default Home;
