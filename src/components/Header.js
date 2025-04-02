import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      className="d-flex justify-content-between align-items-center p-4"
      style={{
        background: "linear-gradient(to right, #003366, #0066cc)",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 className="m-0" style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
        UTEQ
      </h1>
      <nav>
        <ul className="d-flex list-unstyled m-0">
          <li className="mx-3">
            <Link to="/" className="text-white text-decoration-none">
              Home
            </Link>
          </li>
          <li className="mx-3">
            <Link to="/register" className="text-white text-decoration-none">
              Registro
            </Link>
          </li>
          <li className="mx-3">
            <Link to="/login" className="text-white text-decoration-none">
              Login
            </Link>
          </li>
        </ul>
      </nav>
      <img
        src="https://www.idc-latinamerica.com/sites/default/files/2021-07/UTEQ%20Logo.png"
        alt="Logo UTEQ"
        className="header-logo"
        style={{
          height: "60px", // Ajusta el tamaño del logo
          width: "auto",
          borderRadius: "5px", // Bordes redondeados para el logo
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Sombra para darle profundidad
        }}
      />
    </header>
  );
};

export default Header;
