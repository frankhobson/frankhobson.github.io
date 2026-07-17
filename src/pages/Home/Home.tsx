import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Award, ExternalLink } from "lucide-react";
import styles from "./Home.module.css";
import { home } from "../../data/mockData";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import type { HomeData } from "../../types";
import heroImageDefault from "../../assets/hero.png";
import travelImageDefault from "../../assets/travel.png";
import volunteeringImageDefault from "../../assets/volunteering.png";

export const Home: React.FC = () => {
  const [homeData] = useLocalStorageState<HomeData>("portfolio_home", home);

  useEffect(() => {
    document.title = `Portfolio | ${homeData.heroName || "Frank Hobson"}`;
  }, [homeData.heroName]);
  const currentHeroImage = homeData.heroImage || heroImageDefault;
  const currentTravelImage = homeData.galleryTravelImage || travelImageDefault;
  const currentVolunteeringImage =
    homeData.galleryVolunteeringImage || volunteeringImageDefault;

  return (
    <div className={styles.container}>
      {/* Full screen Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img
            src={currentHeroImage}
            alt="Minimalist Art Gallery"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroName}>{homeData.heroName}</h1>
          <p
            className={styles.heroSubtitle}
            dangerouslySetInnerHTML={{ __html: homeData.heroSubtitle }}
          />
        </div>

        <div
          className={styles.scrollIndicator}
          onClick={() => {
            document
              .getElementById("bio-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className={styles.scrollText}>Scroll Down</span>
          <ArrowDown className={styles.scrollIcon} size={18} />
        </div>
      </section>

      {/* Bio / About Section */}
      <section id="bio-section" className={styles.bioSection}>
        <div className={styles.sectionInner}>
          <div className={styles.bioGrid}>
            <div className={styles.bioTextContainer}>
              <span className={styles.sectionLabel}>{homeData.aboutLabel}</span>
              <h2 className={styles.bioHeader}>{homeData.aboutHeadline}</h2>
              {homeData.aboutParagraphs.map((para, idx) => (
                <p key={idx} className={styles.bioBody}>
                  {para}
                </p>
              ))}
            </div>

            <div className={styles.bioMetaCard}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Based In</span>
                <span className={styles.metaValue}>{homeData.metaBasedIn}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Role</span>
                <span className={styles.metaValue}>{homeData.metaRole}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Skills</span>
                <span className={styles.metaValue}>{homeData.metaSkills}</span>
              </div>
              {homeData.certifications && homeData.certifications.length > 0 && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Certifications</span>
                  <div className={styles.certsContainer}>
                    {homeData.certifications.map((cert) => (
                      <div key={cert.id} className={styles.certItem}>
                        <Award size={14} className={styles.certIcon} />
                        <div className={styles.certDetails}>
                          {cert.link ? (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.certNameLink}
                              aria-label={`Verify ${cert.name} certification issued by ${cert.issuer}`}
                            >
                              {cert.name} <ExternalLink size={10} style={{ marginLeft: "2px" }} />
                            </a>
                          ) : (
                            <span className={styles.certName}>{cert.name}</span>
                          )}
                          <span className={styles.certMeta}>
                            {cert.issuer} &middot; {cert.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Photos Section */}
      <section className={styles.photosSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Life & Focus</span>
          <h2 className={styles.sectionHeader}>
            A glimpse into my travel and volunteering experiences
          </h2>

          <div className={styles.photoGrid}>
            <div className={styles.photoItem}>
              <div className={styles.imageFrame}>
                <img
                  src={currentTravelImage}
                  alt="Travel Reflection"
                  className={styles.gridImage}
                />
              </div>
              <div className={styles.photoCaption}>
                <h3>{homeData.galleryTravelTitle}</h3>
                <p>{homeData.galleryTravelDescription}</p>
              </div>
            </div>

            <div className={styles.photoItem}>
              <div className={styles.imageFrame}>
                <img
                  src={currentVolunteeringImage}
                  alt="Collaborative workspace"
                  className={styles.gridImage}
                />
              </div>
              <div className={styles.photoCaption}>
                <h3>{homeData.galleryVolunteeringTitle}</h3>
                <p>{homeData.galleryVolunteeringDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Quick Links */}
      <section className={styles.navigationSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Where to next?</span>
          <h2 className={styles.sectionHeader}>
            Explore my background and experiences
          </h2>

          <div className={styles.cardGrid}>
            <Link to="/work" className={styles.navCard}>
              <div className={styles.cardContent}>
                <span className={styles.cardIndex}>01</span>
                <h3>Work Experience</h3>
                <p>
                  Check out my career timeline, quantitative skills, and
                  professional achievements.
                </p>
                <div className={styles.cardAction}>
                  <span>View Timeline</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            <Link to="/travel" className={styles.navCard}>
              <div className={styles.cardContent}>
                <span className={styles.cardIndex}>02</span>
                <h3>Travel Log</h3>
                <p>
                  View my interactive world map, featuring visited countries and
                  state-level breakdowns.
                </p>
                <div className={styles.cardAction}>
                  <span>Explore Map</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            <Link to="/volunteering" className={styles.navCard}>
              <div className={styles.cardContent}>
                <span className={styles.cardIndex}>03</span>
                <h3>Volunteering</h3>
                <p>
                  Learn about my social impact work, community teaching, and
                  non-profit projects.
                </p>
                <div className={styles.cardAction}>
                  <span>See Impact</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
