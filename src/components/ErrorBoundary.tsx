import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError() as { status?: number; message?: string };
  const navigate = useNavigate();

  return (
    <div className="error-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#dc3545',
          marginBottom: '20px',
          fontSize: '2.5rem'
        }}>
          Oops! Something went wrong
        </h1>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ 
            color: '#6c757d',
            fontSize: '1.1rem',
            marginBottom: '15px'
          }}>
            {error?.status === 404 
              ? "The page you're looking for doesn't exist."
              : "We're sorry, but something went wrong. Please try again later."}
          </p>
          
          {error?.message && (
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              color: '#495057',
              fontSize: '0.9rem',
              overflow: 'auto',
              maxWidth: '100%'
            }}>
              {error.message}
            </pre>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 