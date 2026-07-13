import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { volunteerRoles } from '../../data/mockData';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import type { Volunteering as VolunteeringType } from '../../types';
import styles from './Volunteering.module.css';

export const Volunteering: React.FC = () => {
  const [volunteerData] = useLocalStorageState<VolunteeringType[]>("portfolio_volunteering", volunteerRoles);

  useEffect(() => {
    document.title = "Volunteering | Frank Hobson";
  }, []);
  const featuredRole = volunteerData.find((role) => role.featured);
  const minorRoles = volunteerData.filter((role) => !role.featured);

  // Helper to choose logo or fallback icon for organizations
  const renderCardLogo = (role: VolunteeringType, size = 24) => {
    if (role.iconName === "custom" && role.logoUrl) {
      try {
        const localPath = role.logoUrl;
        let fallbackPath = "";
        
        // Build fallback Google Favicon URL if it is a local download path format
        if (localPath.startsWith("/images/logos/")) {
          const filename = localPath.substring(localPath.lastIndexOf("/") + 1);
          const domain = filename.substring(0, filename.lastIndexOf("."));
          fallbackPath = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
        }
        
        return (
          <img 
            src={localPath}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (fallbackPath && target.src !== fallbackPath) {
                target.src = fallbackPath;
              }
            }}
            alt={`${role.organization} logo`}
            className={styles.orgLogo}
            style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain' }}
          />
        );
      } catch (err) {
        // Fallback to default Lucide icon on error
      }
    }
    const LucideIcon = (role.iconName && (Icons as any)[role.iconName]) || Icons.Users;
    return <LucideIcon size={size} />;
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Social Impact</span>
          <h1 className={styles.title}>Volunteering</h1>
          <p className={styles.subtitle}>
            Giving back to the community, tutoring and mentoring youth, and contributing to global educational outreach.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Top: Featured Primary Impact Role */}
        {featuredRole && (
          <section className={styles.featuredSection}>
            <span className={styles.sectionSublabel}>Featured Project</span>
            <div className={`${styles.featuredCard} ${featuredRole.image ? styles.hasImage : ''}`}>
              {featuredRole.image && (
                <div className={styles.featuredImageWrapper}>
                  <img 
                    src={featuredRole.image} 
                    alt={`${featuredRole.organization} - ${featuredRole.role}`} 
                    className={styles.featuredImage}
                  />
                </div>
              )}
              
              <div className={styles.featuredContent}>
                <div className={styles.featuredHeader}>
                  <div className={styles.iconWrapper}>
                    {renderCardLogo(featuredRole, 28)}
                  </div>
                  <div className={styles.featuredMeta}>
                    <span className={styles.dates}>{featuredRole.dates}</span>
                    <h2 className={styles.roleTitle}>{featuredRole.role}</h2>
                    <h3 className={styles.organization}>{featuredRole.organization}</h3>
                  </div>
                </div>

                <div className={styles.featuredBody}>
                  <p className={styles.description}>{featuredRole.description}</p>
                  
                  <div className={styles.achievementsWrapper}>
                    <h4 className={styles.achievementsHeader}>Key Achievements & Impact</h4>
                    <ul className={styles.achievementsList}>
                      {featuredRole.achievements.map((achievement, idx) => (
                        <li key={idx} className={styles.achievementItem}>
                          <Icons.Heart size={14} className={styles.heartIcon} />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom: Grid of Other Volunteer Activities */}
        <section className={styles.gridSection}>
          <span className={styles.sectionSublabel}>Additional Contributions</span>
          <div className={styles.rolesGrid}>
            {minorRoles.map((role) => (
              <div key={role.id} className={styles.roleCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrapper}>
                    {renderCardLogo(role, 24)}
                  </div>
                  <span className={styles.cardDates}>{role.dates}</span>
                </div>
                
                <h2 className={styles.cardRole}>{role.role}</h2>
                <h3 className={styles.cardOrg}>{role.organization}</h3>
                
                <p className={styles.cardDesc}>{role.description}</p>

                {role.achievements && role.achievements.length > 0 && (
                  <ul className={styles.cardAchievements}>
                    {role.achievements.map((ach, idx) => (
                      <li key={idx} className={styles.cardAchItem}>
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Volunteering;
