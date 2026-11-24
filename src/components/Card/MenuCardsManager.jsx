
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUtensils,
  FaWineGlassAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaChevronRight
} from "react-icons/fa";

import "./MenuCardsManager.scss";

const API =
  "https://restaurant-langhaus-backend.onrender.com/api/menu";

const DRINK_API =
  "https://restaurant-langhaus-backend.onrender.com/api/drinks";

const EMPTY_FORM = {
  name: "",
  start_date: "",
  end_date: "",
  include_in_main_menu: false
};

export default function MenuCardsManager() {
  const [cards, setCards] = useState([]);
  const [drinkCards, setDrinkCards] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingDrinkCard, setEditingDrinkCard] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDrinkCardForm, setShowDrinkCardForm] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [drinkCardForm, setDrinkCardForm] = useState({ ...EMPTY_FORM });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  /*
  ===================================
      DATEN LADEN
  ===================================
  */

  const loadCards = async () => {
    try {
      const res = await axios.get(`${API}/cards`);
      setCards(res.data);
    } catch (err) {
      console.error(err);
      setError("Speisekarten konnten nicht geladen werden.");
    }
  };

  const loadDrinkCards = async () => {
    try {
      const res = await axios.get(`${DRINK_API}/cards`);
      setDrinkCards(res.data);
    } catch (err) {
      console.error(err);
      setError("Getränkekarten konnten nicht geladen werden.");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");

    await Promise.all([
      loadCards(),
      loadDrinkCards()
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  /*
  ===================================
      SPEISEKARTEN
  ===================================
  */

  const edit = (card) => {
    if (!token) return;

    setEditingId(card.id);

    setForm({
      name: card.name,
      start_date: card.start_date || "",
      end_date: card.end_date || "",
      include_in_main_menu: !!card.include_in_main_menu
    });

    setShowForm(true);
  };

  const submit = async () => {
    if (!form.name.trim() || !token) {
      return alert("Bitte einen Namen eingeben und anmelden.");
    }

    try {
      if (editingId) {
        await axios.put(
          `${API}/cards/${editingId}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${API}/cards`,
          form,
          config
        );
      }

      setForm({ ...EMPTY_FORM });
      setEditingId(null);
      setShowForm(false);

      await loadCards();
    } catch (err) {
      console.error(err);
      alert("Speichern der Speisekarte fehlgeschlagen.");
    }
  };

  const remove = async (id) => {
    if (!token) return alert("Bitte anmelden.");

    if (!window.confirm("Möchten Sie diese Speisekarte wirklich löschen?")) {
      return;
    }

    try {
      await axios.delete(
        `${API}/cards/${id}`,
        config
      );

      await loadCards();
    } catch (err) {
      console.error(err);
      alert("Löschen fehlgeschlagen.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  /*
  ===================================
      GETRÄNKEKARTEN
  ===================================
  */

  const editDrinkCard = (card) => {
    setEditingDrinkCard(card.id);

    setDrinkCardForm({
      name: card.name,
      start_date: card.start_date || "",
      end_date: card.end_date || "",
      include_in_main_menu: !!card.include_in_main_menu
    });

    setShowDrinkCardForm(true);
  };

  const submitDrinkCard = async () => {
    if (!drinkCardForm.name.trim() || !token) {
      return alert("Bitte einen Namen eingeben und anmelden.");
    }

    try {
      if (editingDrinkCard) {
        await axios.put(
          `${DRINK_API}/cards/${editingDrinkCard}`,
          drinkCardForm,
          config
        );
      } else {
        await axios.post(
          `${DRINK_API}/cards`,
          drinkCardForm,
          config
        );
      }

      setDrinkCardForm({ ...EMPTY_FORM });
      setEditingDrinkCard(null);
      setShowDrinkCardForm(false);

      await loadDrinkCards();
    } catch (err) {
      console.error(err);
      alert("Speichern der Getränkekarte fehlgeschlagen.");
    }
  };

  const removeDrinkCard = async (id) => {
    if (!token) return alert("Bitte anmelden.");

    if (!window.confirm("Möchten Sie diese Getränkekarte wirklich löschen?")) {
      return;
    }

    try {
      await axios.delete(
        `${DRINK_API}/cards/${id}`,
        config
      );

      await loadDrinkCards();
    } catch (err) {
      console.error(err);
      alert("Löschen fehlgeschlagen.");
    }
  };

  const closeDrinkForm = () => {
    setShowDrinkCardForm(false);
    setEditingDrinkCard(null);
    setDrinkCardForm({ ...EMPTY_FORM });
  };

  /*
  ===================================
      NAVIGATION
  ===================================
  */

  const goToCard = (card) => {
    navigate(`/card/${card.id}`);
  };

  const goToDrinkCard = (card) => {
    navigate(`/drink-card/${card.id}`);
  };

  /*
  ===================================
      FORMULAR
  ===================================
  */

  const renderForm = (
    title,
    currentForm,
    setCurrentForm,
    onSubmit,
    onClose,
    submitLabel
  ) => (
    <div
      className="menu-modal-overlay"
      onClick={onClose}
    >
      <div
        className="menu-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="menu-modal-close"
          onClick={onClose}
          aria-label="Schliessen"
        >
          <FaTimes />
        </button>

        <span className="menu-eyebrow">
          RESTAURANT LANGHAUS
        </span>

        <h2>{title}</h2>

        <div className="menu-gold-line"></div>

        <div className="menu-form">

          <label>Name der Karte</label>

          <input
            type="text"
            placeholder="z. B. Speisekarte Herbst"
            value={currentForm.name}
            onChange={(e) =>
              setCurrentForm({
                ...currentForm,
                name: e.target.value
              })
            }
          />

          <div className="menu-date-grid">

            <div>
              <label>Startdatum</label>

              <input
                type="date"
                value={currentForm.start_date}
                onChange={(e) =>
                  setCurrentForm({
                    ...currentForm,
                    start_date: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label>Enddatum</label>

              <input
                type="date"
                value={currentForm.end_date}
                onChange={(e) =>
                  setCurrentForm({
                    ...currentForm,
                    end_date: e.target.value
                  })
                }
              />
            </div>

          </div>

          <label className="menu-checkbox">
            <input
              type="checkbox"
              checked={currentForm.include_in_main_menu}
              onChange={(e) =>
                setCurrentForm({
                  ...currentForm,
                  include_in_main_menu: e.target.checked
                })
              }
            />

            <span>
              Im Hauptmenü anzeigen
            </span>
          </label>

          <div className="menu-modal-actions">

            <button
              className="menu-primary-button"
              onClick={onSubmit}
            >
              {submitLabel}
            </button>

            <button
              className="menu-cancel-button"
              onClick={onClose}
            >
              Abbrechen
            </button>

          </div>

        </div>
      </div>
    </div>
  );

  /*
  ===================================
      RENDER
  ===================================
  */

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="menu-spinner"></div>
        <span>Restaurant Langhaus</span>
      </div>
    );
  }

  return (
    <main className="cards-manager">

      {/* HEADER */}

      <section className="cards-manager__hero">

        <span className="menu-eyebrow">
          RESTAURANT LANGHAUS
        </span>

        <h1>Unsere Speisekarten</h1>

        <div className="menu-gold-line"></div>

        <p>
          Entdecken Sie unsere kulinarische Auswahl
          und die passenden Getränkekarten.
        </p>

      </section>

      {/* ÜBERSICHT */}

      <section className="menu-overview">

        <div className="menu-overview-item">
          <FaUtensils />

          <div>
            <strong>{cards.length}</strong>
            <span>Speisekarten</span>
          </div>
        </div>

        <div className="menu-overview-item">
          <FaWineGlassAlt />

          <div>
            <strong>{drinkCards.length}</strong>
            <span>Getränkekarten</span>
          </div>
        </div>

      </section>

      {error && (
        <div className="menu-error">
          {error}
        </div>
      )}

      {/* SPEISEKARTEN */}

      <section className="menu-section">

        <div className="menu-section-heading">

          <div>
            <span className="menu-eyebrow">
              KULINARISCHES ANGEBOT
            </span>

            <h2>Speisekarten</h2>
          </div>

          {token && (
            <button
              className="menu-add-button"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY_FORM });
                setShowForm(true);
              }}
            >
              <FaPlus />
              Neue Speisekarte
            </button>
          )}

        </div>

        <div className="menu-card-grid">

          {cards.length > 0 ? (
            cards.map((card) => (
              <article
                key={card.id}
                className="menu-item-card"
                onClick={() => goToCard(card)}
              >

                <div className="menu-item-icon">
                  <FaUtensils />
                </div>

                <div className="menu-item-content">

                  <h3>{card.name}</h3>

                  {token && (
                    <div className="menu-item-meta">

                      {(card.start_date || card.end_date) && (
                        <span>
                          <FaCalendarAlt />

                          {card.start_date || "–"}
                          {" – "}
                          {card.end_date || "–"}
                        </span>
                      )}

                      <span>
                        {card.include_in_main_menu
                          ? <FaEye />
                          : <FaEyeSlash />}

                        {card.include_in_main_menu
                          ? "Im Hauptmenü sichtbar"
                          : "Nicht im Hauptmenü"}
                      </span>

                    </div>
                  )}

                  <span className="menu-item-link">
                    Karte ansehen
                    <FaChevronRight />
                  </span>

                </div>

                {token && (
                  <div className="menu-item-actions">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        edit(card);
                      }}
                      aria-label="Speisekarte bearbeiten"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(card.id);
                      }}
                      aria-label="Speisekarte löschen"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )}

              </article>
            ))
          ) : (
            <div className="menu-empty">
              <FaUtensils />
              <p>Aktuell sind keine Speisekarten vorhanden.</p>
            </div>
          )}

        </div>

      </section>

      {/* GETRÄNKEKARTEN */}

      <section className="menu-section drink-section">

        <div className="menu-section-heading">

          <div>
            <span className="menu-eyebrow">
              PASSENDE BEGLEITUNG
            </span>

            <h2>Getränkekarten</h2>
          </div>

          {token && (
            <button
              className="menu-add-button"
              onClick={() => {
                setEditingDrinkCard(null);
                setDrinkCardForm({ ...EMPTY_FORM });
                setShowDrinkCardForm(true);
              }}
            >
              <FaPlus />
              Neue Getränkekarte
            </button>
          )}

        </div>

        <div className="menu-card-grid">

          {drinkCards.length > 0 ? (
            drinkCards.map((card) => (
              <article
                key={card.id}
                className="menu-item-card drink-card"
                onClick={() => goToDrinkCard(card)}
              >

                <div className="menu-item-icon">
                  <FaWineGlassAlt />
                </div>

                <div className="menu-item-content">

                  <h3>{card.name}</h3>

                  {token && (
                    <div className="menu-item-meta">

                      <span>
                        {card.categories?.length || 0} Kategorien
                      </span>

                      <span>
                        {card.include_in_main_menu
                          ? <FaEye />
                          : <FaEyeSlash />}

                        {card.include_in_main_menu
                          ? "Im Hauptmenü sichtbar"
                          : "Nicht im Hauptmenü"}
                      </span>

                    </div>
                  )}

                  <span className="menu-item-link">
                    Karte ansehen
                    <FaChevronRight />
                  </span>

                </div>

                {token && (
                  <div className="menu-item-actions">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editDrinkCard(card);
                      }}
                      aria-label="Getränkekarte bearbeiten"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDrinkCard(card.id);
                      }}
                      aria-label="Getränkekarte löschen"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )}

              </article>
            ))
          ) : (
            <div className="menu-empty">
              <FaWineGlassAlt />
              <p>Aktuell sind keine Getränkekarten vorhanden.</p>
            </div>
          )}

        </div>

      </section>

      {/* SPEISEKARTEN FORMULAR */}

      {showForm && renderForm(
        editingId ? "Speisekarte bearbeiten" : "Neue Speisekarte erstellen",
        form,
        setForm,
        submit,
        closeForm,
        editingId ? "Änderungen speichern" : "Speisekarte erstellen"
      )}

      {/* GETRÄNKEKARTEN FORMULAR */}

      {showDrinkCardForm && renderForm(
        editingDrinkCard ? "Getränkekarte bearbeiten" : "Neue Getränkekarte erstellen",
        drinkCardForm,
        setDrinkCardForm,
        submitDrinkCard,
        closeDrinkForm,
        editingDrinkCard ? "Änderungen speichern" : "Getränkekarte erstellen"
      )}

    </main>
  );
}
