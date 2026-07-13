import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { projects } from '../../data/mockData';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import type { Project } from '../../types';
import styles from './Projects.module.css';

export const Projects: React.FC = () => {
  const [projectList] = useLocalStorageState<Project[]>("portfolio_projects", projects);

  useEffect(() => {
    document.title = "Projects | Frank Hobson";
  }, []);

  const getProjectImagePath = (filename?: string) => {
    if (!filename) return "/images/projects/default.png";
    if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) {
      return filename;
    }
    return `/images/projects/${filename}`;
  };

  const renderProjectIcon = (project: Project, size = 24) => {
    const LucideIcon = (project.iconName && (Icons as any)[project.iconName]) || Icons.Code;
    return <LucideIcon size={size} />;
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Technical Ventures</span>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            A curated showcase of applications, tools, and interactive media designed and built using the Antigravity AI coding assistant.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.grid}>
          {projectList.map((project) => (
            <div key={project.id} className={`${styles.card} ${project.status === 'wip' ? styles.wipCard : ''}`}>
              {/* Image on top, similar to Travel pop-up headers */}
              <div className={styles.imageContainer}>
                <img 
                  src={getProjectImagePath(project.imageUrl)} 
                  alt={project.title} 
                  className={styles.projectImage} 
                />
                <div className={styles.badgeOverlay}>
                  {project.status === 'wip' ? (
                    <span className={`${styles.badge} ${styles.wipBadge}`}>
                      <Icons.Clock size={12} className={styles.badgeIcon} /> Work In Progress
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.completedBadge}`}>
                      <Icons.Calendar size={12} className={styles.badgeIcon} /> Last updated {project.lastUpdated || "07/2026"}
                    </span>
                  )}
                </div>
              </div>

              {/* Card body & description underneath */}
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {renderProjectIcon(project)}
                  </div>
                  <div className={styles.headerText}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <h4 className={styles.projectSubtitle}>{project.subtitle}</h4>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.projectDesc}>{project.description}</p>
                  
                  <div className={styles.techStack}>
                    {project.techStack.map((tech) => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action links */}
              <div className={styles.cardFooter}>
                {project.status === 'completed' && project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryLink}
                    aria-label={`Launch ${project.title} live`}
                  >
                    Launch Live <Icons.ExternalLink size={14} className={styles.linkIcon} />
                  </a>
                )}
                {project.status === 'completed' && project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryLink}
                    aria-label={`View ${project.title} source code on GitHub`}
                  >
                    Source Code <Icons.Code size={14} className={styles.linkIcon} />
                  </a>
                )}
                {project.status === 'wip' && (
                  <div className={styles.wipBanner}>
                    <Icons.Settings className={styles.wipSpinner} size={14} /> Coding underway...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
