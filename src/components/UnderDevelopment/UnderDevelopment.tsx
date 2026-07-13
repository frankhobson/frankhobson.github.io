import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import styles from './UnderDevelopment.module.css';

interface UnderDevelopmentProps {
  tabName: string;
}

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ tabName }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const capitalizedTab = tabName === 'home' ? 'Home' : tabName.charAt(0).toUpperCase() + tabName.slice(1);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Construction size={48} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Under Development</h1>
        <p className={styles.message}>
          The <strong>{capitalizedTab}</strong> section is currently undergoing maintenance and improvements. Please check back later.
        </p>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
};

export default UnderDevelopment;
