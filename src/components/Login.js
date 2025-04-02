import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Respuesta:", response.data);

      if (response.data.message === "Login exitoso") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
      console.error("Error de inicio de sesión", error);
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
          borderRadius: "15px",  // Agrega bordes redondeados más marcados
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "#003366",
            letterSpacing: "1px", // Añade un poco de espacio entre letras para darle estilo
          }}
        >
          Iniciar Sesión
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
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
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Agrega una sombra sutil para darle profundidad
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
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Igual, sombra sutil
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
                borderRadius: "30px", // Bordes completamente redondeados
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", // Más sombra para darle un toque de profundidad
                transition: "all 0.3s ease", // Transición suave para el hover
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#004d99"; // Color de fondo más oscuro al pasar el ratón
                e.target.style.transform = "scale(1.05)"; // Aumentar tamaño al hacer hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#0066cc"; // Restaurar color original
                e.target.style.transform = "scale(1)"; // Restaurar tamaño
              }}
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
