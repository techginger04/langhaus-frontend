
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  FaTrash,
  FaUpload,
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./Galerie.scss";

const API =
  "https://restaurant-langhaus-backend.onrender.com/api";

const GALERIE_API = `${API}/galerie`;

const IMAGE_BASE =
  "https://restaurant-langhaus-backend.onrender.com/uploads";

const Galerie = () => {

  // AUTH
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin =
    user?.userTypes?.includes("admin");

  // STATES
  const [bilder, setBilder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // BILDER LADEN
  const fetchGalerie = useCallback(async () => {
    try {
      const res = await axios.get(GALERIE_API);
      setBilder(res.data || []);
    } catch (err) {
      console.error("Galerie konnte nicht geladen werden", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalerie();
  }, [fetchGalerie]);

  // UPLOAD
  const handleUpload = async () => {

    if (!token) {
      alert("Nicht eingeloggt");
      return;
    }

    if (uploadFiles.length === 0) {
      alert("Bitte Bilder auswählen");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      uploadFiles.forEach((file) => {
        formData.append("bilder", file);
      });

      await axios.post(
        `${GALERIE_API}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadFiles([]);

      await fetchGalerie();

      alert("Upload erfolgreich!");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        "Upload fehlgeschlagen"
      );

    } finally {
      setUploading(false);
    }
  };

  // LÖSCHEN
  const handleDelete = async (id) => {

    const ok = window.confirm(
      "Möchtest du dieses Bild wirklich löschen?"
    );

    if (!ok) return;

    try {
      await axios.delete(
        `${GALERIE_API}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBilder((prev) =>
        prev.filter((b) => b.id !== id)
      );

      if (activeIndex !== null) {
        setActiveIndex(null);
      }

      alert("Bild erfolgreich gelöscht!");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        "Löschen fehlgeschlagen"
      );
    }
  };

  // LIGHTBOX
  const closeFullscreen = () => {
    setActiveIndex(null);
  };

  const nextBild = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i + 1) % bilder.length
    );
  }, [bilder.length]);

  const prevBild = useCallback(() => {
    setActiveIndex((i) =>
      i === null
        ? null
        : (i - 1 + bilder.length) % bilder.length
    );
  }, [bilder.length]);

  // TASTATURSTEUERUNG
  useEffect(() => {

    if (activeIndex === null) return;

    const handleKey = (e) => {

      if (e.key === "Escape") {
        closeFullscreen();
      }

      if (e.key === "ArrowRight") {
        nextBild();
      }

      if (e.key === "ArrowLeft") {
        prevBild();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };

  }, [activeIndex, nextBild, prevBild]);

  // LOADING
  if (loading) {
    return (
      <div className="galerie-loading">
        <div className="loading-spinner"></div>
        <p>Unsere Galerie wird geladen ...</p>
      </div>
    );
  }

  return (

    <main className="galerie-container">

      {/* HEADER */}

      <header className="galerie-header">

        <span className="galerie-eyebrow">
          RESTAURANT LANGHAUS
        </span>

        <h1>
          Unsere <span>Galerie</span>
        </h1>

        <div className="galerie-divider"></div>

        <p>
          Entdecke besondere Momente, kulinarische Eindrücke
          und die Atmosphäre unseres Restaurants.
        </p>

      </header>

      {/* ADMIN UPLOAD */}

      {isAdmin && (

        <section className="upload-section">

          <div className="upload-heading">

            <div className="upload-icon">
              <FaImages />
            </div>

            <div>
              <h2>Galerie verwalten</h2>
              <p>Neue Bilder zum Restaurant hinzufügen.</p>
            </div>

          </div>

          <label className="upload-dropzone">

            <FaUpload className="upload-main-icon" />

            <strong>
              Bilder auswählen
            </strong>

            <span>
              Klicke hier, um Bilder von deinem Gerät auszuwählen.
            </span>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setUploadFiles(
                  Array.from(e.target.files || [])
                )
              }
            />

          </label>

          {uploadFiles.length > 0 && (

            <div className="selected-files">
              <span>
                {uploadFiles.length} Bild(er) ausgewählt
              </span>

              <button
                type="button"
                onClick={() => setUploadFiles([])}
              >
                Auswahl entfernen
              </button>
            </div>

          )}

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={uploading || uploadFiles.length === 0}
          >

            <FaUpload />

            {uploading
              ? "Bilder werden hochgeladen ..."
              : "Bilder hochladen"}

          </button>

        </section>

      )}

      {/* GALERIE */}

      <section className="galerie-section">

        <div className="galerie-section-heading">

          <div>
            <span className="section-eyebrow">
              EINBLICKE
            </span>

            <h2>Momente im Langhaus</h2>
          </div>

          <span className="bild-anzahl">
            {bilder.length} Bilder
          </span>

        </div>

        {bilder.length === 0 ? (

          <div className="galerie-empty">

            <FaImages />

            <h3>Noch keine Bilder vorhanden</h3>

            <p>
              Hier findest du bald Eindrücke aus unserem Restaurant.
            </p>

          </div>

        ) : (

          <div className="galerie-grid">

            {bilder.map((b, i) => (

              <div
                key={b.id}
                className="galerie-item"
              >

                <button
                  className="galerie-image-button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Bild ${i + 1} vergrössern`}
                >

                  <img
                    src={`${IMAGE_BASE}${b.bild}`}
                    alt={`Restaurant Langhaus – Eindruck ${i + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://dummyimage.com/600x400/f3f0e9/777777&text=Bild+nicht+verfuegbar";
                    }}
                  />

                  <div className="image-overlay">
                    <span>Bild ansehen</span>
                  </div>

                </button>

                {isAdmin && (

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(b.id)}
                    aria-label="Bild löschen"
                    title="Bild löschen"
                  >
                    <FaTrash />
                  </button>

                )}

              </div>

            ))}

          </div>

        )}

      </section>

      {/* LIGHTBOX */}

      {activeIndex !== null && bilder[activeIndex] && (

        <div
          className="lightbox"
          onClick={closeFullscreen}
        >

          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreen();
            }}
            aria-label="Schliessen"
          >
            <FaTimes />
          </button>

          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              prevBild();
            }}
            aria-label="Vorheriges Bild"
          >
            <FaChevronLeft />
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={`${IMAGE_BASE}${bilder[activeIndex].bild}`}
              alt="Restaurant Langhaus"
            />

            <div className="lightbox-caption">
              <span>RESTAURANT LANGHAUS</span>
              <p>
                {activeIndex + 1} / {bilder.length}
              </p>
            </div>

          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              nextBild();
            }}
            aria-label="Nächstes Bild"
          >
            <FaChevronRight />
          </button>

        </div>

      )}

    </main>
  );
};

export default Galerie;
