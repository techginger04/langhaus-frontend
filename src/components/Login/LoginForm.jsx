
import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.scss";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://restaurant-langhaus-backend.onrender.com/api/login",
        { username, password }
      );

      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ userTypes: ["admin"] })
      );

      window.location.href = "/";
    } catch (error) {
      setError(
        error.response?.data?.error ||
        "Fehler beim Login. Bitte überprüfe deinen Benutzernamen und dein Passwort."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">

        <div className="login-eyebrow">
          RESTAURANT LANGHAUS
        </div>

        <div className="login-decoration">
          <span />
          <span />
          <span />
        </div>

        <h1 className="login-title">
          Willkommen zurück
        </h1>

        <p className="login-description">
          Melde dich an, um den Administrationsbereich
          des Restaurant Langhaus aufzurufen.
        </p>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="username">
              Benutzername
            </label>

            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Benutzername eingeben"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Passwort
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Anmeldung läuft ..." : "Anmelden"}
          </button>

        </form>

        <div className="login-footer">
          Restaurant Langhaus · Administration
        </div>

      </div>
    </main>
  );
};

export default LoginForm;
