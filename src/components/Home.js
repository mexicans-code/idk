import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <section
        className="hero bg-primary text-white text-center py-5 mt-5"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/75/87/df/7587df77ef521cf98057d0028ee983f1.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "700px",
        }}
      >
        <div className="container mt-5">
          <h1 className="display-3 fw-bold mb-4 text-danger mt-5">Seguridad Informática</h1>
          <p className="lead mb-4 fw-bold mt-5">
            Protege tus datos y tu privacidad con nuestras soluciones avanzadas de seguridad informática.
          </p>
          <div className="mt-5">
            <Link to="/login" className="btn btn-dark btn-lg me-3 mt-5">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg mt-5">
              Registrarse
            </Link>
          </div>
        </div>
      </section>    
    </div>
  );
};

export default Home;
