import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://server-41642489028.us-central1.run.app/register", {
        email,
        password,
      });
      setMessage(response.data.message);
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      setMessage("Error en el registro");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-5 rounded"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "#003366",
            letterSpacing: "1px", // Espaciado entre letras para el título
          }}
        >
          Registro
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="form-label" htmlFor="email" style={{ fontSize: "1.1rem" }}>
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "0.9rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="password" style={{ fontSize: "1.1rem" }}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "0.9rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
              }}
            />
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                padding: "0.8rem 0",
                fontSize: "1.1rem",
                borderRadius: "30px", // Bordes redondeados del botón
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", // Sombra en el botón
                transition: "all 0.3s ease", // Transición para el hover
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#004d99"; // Cambio de color en hover
                e.target.style.transform = "scale(1.05)"; // Escalado en hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#0066cc"; // Restaurar color
                e.target.style.transform = "scale(1)"; // Restaurar tamaño
              }}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
