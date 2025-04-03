const errorHandler = (err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Error interno del servidor' : err.message;
    
    res.status(statusCode).json({
      error: message
    });
  };
  
  module.exports = errorHandler;