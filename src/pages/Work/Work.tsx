import React, { useEffect } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { experiences } from '../../data/mockData';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import type { Experience } from '../../types';
import styles from './Work.module.css';

export const Work: React.FC = () => {
  const [workData] = useLocalStorageState<Experience[]>("portfolio_experiences", experiences);

  useEffect(() => {
    document.title = "Work Experience | Frank Hobson";
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Career Timeline</span>
          <h1 className={styles.title}>Work Experience</h1>
          <p className={styles.subtitle}>
            A chronological overview of my professional path, core technologies, and key achievements.
          </p>
        </div>
      </header>

      <section className={styles.timelineSection}>
        <div className={styles.timelineContainer}>
          {/* Vertical axis line */}
          <div className={styles.timelineLine} />

          {workData.map((exp) => (
            <div 
              key={exp.id} 
              className={styles.timelineItem}
            >
              {/* Timeline node */}
              <div className={styles.timelineNode}>
                <div className={styles.nodeInner}>
                  <Briefcase size={14} />
                </div>
              </div>

              {/* Timeline card content */}
              <div className={styles.timelineCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.roleHeader}>
                    <span className={styles.dates}>
                      <Calendar size={12} />
                      {exp.dates}
                    </span>
                    <h2 className={styles.role}>{exp.role}</h2>
                    <h3 className={styles.company}>
                      {exp.company}
                      {exp.link && (
                        <a 
                          href={exp.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.companyLink}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Visit ${exp.company} website`}
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </h3>
                  </div>
                  
                  <div className={styles.location}>
                    <MapPin size={12} />
                    {exp.location}
                  </div>
                </div>

                {/* Bullet points */}
                <div className={styles.cardBody}>
                  <ul className={styles.bulletsList}>
                    {exp.description.map((bullet, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Tags */}
                <div className={styles.tagsContainer}>
                  {exp.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Work;
