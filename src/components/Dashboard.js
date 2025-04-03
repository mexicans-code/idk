import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar usuarios
  const loadUsers = () => {
    axios.get("https://server-41642489028.us-central1.run.app/users")
    .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los usuarios", error);
        setError("Error al cargar los usuarios");
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      axios.delete(`https://server-41642489028.us-central1.run.app/users/${id}`)
        .then(response => {
          setSuccess("Usuario eliminado con éxito");
          loadUsers(); // Recargar la lista de usuarios
        })
        .catch(error => {
          console.error("Error al eliminar usuario", error);
          setError("Error al eliminar usuario");
        });
    }
  };

  // Preparar edición
  const handleEdit = (user) => {
    setEditUser(user);
    setEmail(user.email);
    setPassword(""); // No mostrar la contraseña actual
  };

  // Guardar cambios
  const handleSave = (e) => {
    e.preventDefault();
    
    const updateData = { email };
    if (password) updateData.password = password;
    
    axios.put(`https://server-41642489028.us-central1.run.app/users/${editUser.id}`, updateData)
      .then(response => {
        setSuccess("Usuario actualizado con éxito");
        setEditUser(null);
        loadUsers(); // Recargar la lista de usuarios
      })
      .catch(error => {
        console.error("Error al actualizar usuario", error);
        setError("Error al actualizar usuario");
      });
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditUser(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard - Lista de Usuarios</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editUser ? (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5>Editar Usuario</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
