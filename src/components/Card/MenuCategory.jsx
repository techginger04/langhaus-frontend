import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MenuCategory.scss";

const API = "https://restaurant-langhaus-backend.onrender.com/api/menu";

export default function MenuCategory() {
  const { cardId } = useParams();
  const token = localStorage.getItem("token");

  const [cardData, setCardData] = useState({
    card: {},
    categories: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");

  const [gerichtForm, setGerichtForm] = useState({
    nummer: "",
    name: "",
    zutaten: "",
    preis: ""
  });

  const isMainMenuCard = cardId === "1";

  const resetGerichtForm = () => {
    setGerichtForm({
      nummer: "",
      name: "",
      zutaten: "",
      preis: ""
    });
  };

  const loadCard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (isMainMenuCard) {
        const res = await axios.get(`${API}/main-menu`);

        const combinedCategories = [];

        res.data.forEach(({ card, categories }) => {
          categories.forEach((cat) => {
            combinedCategories.push({
              ...cat,
              cardName: card.name
            });
          });
        });

        setCardData({
          card: {
            id: "1",
            name: "Hauptspeisekarte"
          },
          categories: combinedCategories
        });
      } else {
        const res = await axios.get(
          `${API}/cards/${cardId}/categories`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined
          }
        );

        setCardData({
          card: {
            id: cardId,
            name: res.data.card?.name || "Karte"
          },
          categories: res.data.categories || []
        });
      }
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setError("Die Speisekarte konnte leider nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [cardId, token, isMainMenuCard]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  // Kategorie erstellen
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName.trim() || !token) return;

    try {
      await axios.post(
        `${API}/cards/${cardId}/categories`,
        { name: newCategoryName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewCategoryName("");
      await loadCard();
    } catch (err) {
      console.error("Kategorie konnte nicht erstellt werden:", err);
      alert("Die Kategorie konnte nicht erstellt werden.");
    }
  };

  // Popup zum Erstellen öffnen
  const openGerichtPopup = (categoryId) => {
    setCurrentCategoryId(categoryId);
    resetGerichtForm();
    setPopupOpen(true);
  };

  // Gericht erstellen
  const handleCreateGericht = async (e) => {
    e.preventDefault();

    if (!token || !currentCategoryId) return;

    try {
      await axios.post(
        `${API}/categories/${currentCategoryId}/items`,
        gerichtForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPopupOpen(false);
      resetGerichtForm();
      await loadCard();
    } catch (err) {
      console.error("Gericht konnte nicht erstellt werden:", err);
      alert("Das Gericht konnte nicht erstellt werden.");
    }
  };

  // Popup zum Bearbeiten öffnen
  const openEditPopup = (gericht) => {
    setCurrentItemId(gericht.id);

    setGerichtForm({
      nummer: gericht.nummer || "",
      name: gericht.name || "",
      zutaten: gericht.zutaten || "",
      preis: gericht.preis || ""
    });

    setEditPopupOpen(true);
  };

  // Gericht aktualisieren
  const handleUpdateGericht = async (e) => {
    e.preventDefault();

    if (!token || !currentItemId) return;

    try {
      await axios.put(
        `${API}/items/${currentItemId}`,
        gerichtForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditPopupOpen(false);
      resetGerichtForm();
      setCurrentItemId(null);

      await loadCard();
    } catch (err) {
      console.error("Gericht konnte nicht aktualisiert werden:", err);
      alert("Das Gericht konnte nicht gespeichert werden.");
    }
  };

  // Gericht löschen
  const handleDeleteGericht = async (itemId) => {
    if (!token) return;

    if (!window.confirm("Möchtest du dieses Gericht wirklich löschen?")) {
      return;
    }

    try {
      await axios.delete(`${API}/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await loadCard();
    } catch (err) {
      console.error("Gericht konnte nicht gelöscht werden:", err);
      alert("Das Gericht konnte nicht gelöscht werden.");
    }
  };

  // PDF herunterladen
  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        `${API}/cards/${cardId}/pdf`,
        {
          responseType: "blob",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      const blob = new Blob(
        [response.data],
        { type: "application/pdf" }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fileName = (cardData.card?.name || "speisekarte")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      link.href = url;
      link.download = `${fileName}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF-Download fehlgeschlagen:", err);
      alert("Die Speisekarte konnte nicht heruntergeladen werden.");
    }
  };

  // Formular für Gerichte
  const renderGerichtForm = (onSubmit, buttonText) => (
    <form onSubmit={onSubmit}>
      <div className="form-field">
        <label>Gerichtenummer</label>
        <input
          placeholder="z. B. 101"
          value={gerichtForm.nummer}
          onChange={(e) =>
            setGerichtForm({
              ...gerichtForm,
              nummer: e.target.value
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Name des Gerichts *</label>
        <input
          placeholder="Name des Gerichts"
          required
          value={gerichtForm.name}
          onChange={(e) =>
            setGerichtForm({
              ...gerichtForm,
              name: e.target.value
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Zutaten und Beschreibung</label>
        <textarea
          placeholder="Zutaten oder kurze Beschreibung"
          rows="3"
          value={gerichtForm.zutaten}
          onChange={(e) =>
            setGerichtForm({
              ...gerichtForm,
              zutaten: e.target.value
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Preis in CHF *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="z. B. 24.50"
          required
          value={gerichtForm.preis}
          onChange={(e) =>
            setGerichtForm({
              ...gerichtForm,
              preis: e.target.value
            })
          }
        />
      </div>

      <div className="popup-actions">
        <button type="submit" className="button-primary">
          {buttonText}
        </button>

        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            setPopupOpen(false);
            setEditPopupOpen(false);
            resetGerichtForm();
          }}
        >
          Abbrechen
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="menu-category-loading">
        <div className="loading-spinner" />
        <p>Speisekarte wird geladen ...</p>
      </div>
    );
  }

  return (
    <main className="menu-card-view">
      <div className="menu-category-container">

        {/* Kopfbereich */}
        <header className="menu-category-header">
          <div className="menu-category-eyebrow">
            RESTAURANT LANGHAUS
          </div>

          <h1>{cardData.card.name}</h1>

          <div className="heading-decoration">
            <span />
            <span />
            <span />
          </div>

          <p>
            Entdecke unsere Auswahl an frisch zubereiteten
            Speisen und Spezialitäten.
          </p>

          {token && (
            <button
              className="download-pdf"
              onClick={downloadPDF}
              type="button"
            >
              <span className="pdf-icon">↓</span>
              Speisekarte als PDF herunterladen
            </button>
          )}
        </header>

        {error && (
          <div className="menu-category-error">
            {error}
            <button onClick={loadCard} type="button">
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Neue Kategorie */}
        {token && (
          <section className="new-category">
            <div className="admin-section-heading">
              <span className="admin-label">ADMINISTRATION</span>
              <h2>Neue Kategorie hinzufügen</h2>
            </div>

            <form onSubmit={handleCreateCategory}>
              <input
                placeholder="Name der Kategorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />

              <button type="submit" className="button-primary">
                Kategorie erstellen
              </button>
            </form>
          </section>
        )}

        {/* Kategorien */}
        <div className="categories-list">
          {cardData.categories.length > 0 ? (
            cardData.categories.map((category) => (
              <section key={category.id} className="category">
                {category.cardName && isMainMenuCard && (
                  <div className="category-card-name">
                    {category.cardName}
                  </div>
                )}

                <div className="category-heading">
                  <span className="category-line" />
                  <h2>{category.name}</h2>
                  <span className="category-line" />
                </div>

                <ul className="category-gerichte">
                  {category.items?.length > 0 ? (
                    category.items.map((gericht) => (
                      <li key={gericht.id} className="gericht">
                        <div className="gericht-content">
                          <div className="gericht-row">
                            <div className="gericht-name-wrapper">
                              {gericht.nummer && (
                                <span className="gericht-nummer">
                                  {gericht.nummer}
                                </span>
                              )}

                              <span className="name">
                                {gericht.name}
                              </span>
                            </div>

                            <span className="preis">
                              CHF {Number(gericht.preis).toFixed(2)}
                            </span>
                          </div>

                          {gericht.zutaten && (
                            <div className="zutaten">
                              {gericht.zutaten}
                            </div>
                          )}
                        </div>

                        {token && (
                          <div className="actions">
                            <button
                              type="button"
                              onClick={() => openEditPopup(gericht)}
                            >
                              Bearbeiten
                            </button>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleDeleteGericht(gericht.id)
                              }
                            >
                              Löschen
                            </button>
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="no-gerichte">
                      Aktuell sind in dieser Kategorie keine Gerichte
                      vorhanden.
                    </li>
                  )}
                </ul>

                {token && (
                  <button
                    className="add-gericht"
                    type="button"
                    onClick={() => openGerichtPopup(category.id)}
                  >
                    <span>+</span>
                    Neues Gericht hinzufügen
                  </button>
                )}
              </section>
            ))
          ) : (
            <div className="empty-menu">
              <h2>Unsere Speisekarte</h2>
              <p>
                Momentan sind noch keine Kategorien vorhanden.
              </p>
            </div>
          )}
        </div>

        {/* Create Popup */}
        {popupOpen && (
          <div
            className="popup-overlay"
            onClick={() => setPopupOpen(false)}
          >
            <div
              className="popup-form"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-heading">
                <span className="admin-label">ADMINISTRATION</span>
                <h2>Neues Gericht</h2>
                <p>Füge ein neues Gericht zur Kategorie hinzu.</p>
              </div>

              {renderGerichtForm(handleCreateGericht, "Gericht erstellen")}
            </div>
          </div>
        )}

        {/* Edit Popup */}
        {editPopupOpen && (
          <div
            className="popup-overlay"
            onClick={() => setEditPopupOpen(false)}
          >
            <div
              className="popup-form"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-heading">
                <span className="admin-label">ADMINISTRATION</span>
                <h2>Gericht bearbeiten</h2>
                <p>Ändere die Angaben des ausgewählten Gerichts.</p>
              </div>

              {renderGerichtForm(handleUpdateGericht, "Änderungen speichern")}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}