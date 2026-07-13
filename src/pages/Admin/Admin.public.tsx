import React from 'react';

export const Admin: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        404 - Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.6' }}>
        The requested page does not exist or has been disabled in this environment.
      </p>
    </div>
  );
};

export default Admin;
