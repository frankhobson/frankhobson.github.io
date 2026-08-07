import React, { useState, useEffect } from "react";
import {
  Monitor,
  MapPin,
  Gift,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
} from "lucide-react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { tutoring } from "../../data/mockData";
import type { TutoringData } from "../../types";
import styles from "./Tutoring.module.css";

const renderUclaText = (text: string) => {
  const colors = ["#2774AE", "#FFD100"];
  return (
    <span style={{ fontWeight: 800, letterSpacing: "0.02em" }}>
      {text.split("").map((char, index) => (
        <span key={index} style={{ color: colors[index % 2] }}>
          {char}
        </span>
      ))}
    </span>
  );
};

const formatTextWithUcla = (text: string) => {
  if (!text) return text;
  const parts = text.split(/(UCLA)/g);
  return parts.map((part, idx) =>
    part === "UCLA" ? <React.Fragment key={idx}>{renderUclaText("UCLA")}</React.Fragment> : part
  );
};

export const Tutoring: React.FC = () => {
  const [tutoringData] = useLocalStorageState<TutoringData>(
    "portfolio_tutoring",
    tutoring,
  );

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Tutoring | Frank Hobson";
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {/* Standardized Page Header (Matches Work, Projects & Volunteering pages) */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>TUTORING SERVICES</span>
          <h1 className={styles.title}>{tutoringData.heroTitle}</h1>
          <p className={styles.subtitle}>{tutoringData.heroSubtitle}</p>
          <div className={styles.headerActions}>
            <a href="#inquiry-form" className={styles.primaryCta}>
              <Mail size={16} /> Request Session
            </a>
            <a href="#rates-and-formats" className={styles.secondaryCta}>
              View Rates & Formats
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Feed — Every section is a clean, unified card block */}
      <div className={styles.content}>
        {/* Section 1: Meet Your Tutor */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSublabel}>ABOUT YOUR TUTOR</span>
            <h2 className={styles.sectionTitle}>{tutoringData.aboutHeading}</h2>
            <p className={styles.sectionSubtitle}>
              Quantitative systems analyst & {formatTextWithUcla("UCLA")} Applied Mathematics graduate
            </p>
          </div>

          {/* 3-Line Stat Cards */}
          <div className={styles.statsGrid}>
            {(tutoringData.stats || []).map((stat) => (
              <div key={stat.id} className={styles.statCard}>
                <span className={styles.statTopLabel}>{stat.topLabel}</span>
                <span className={styles.statBig}>{formatTextWithUcla(stat.bigStat)}</span>
                <span className={styles.statSubtext}>{stat.subtext}</span>
              </div>
            ))}
          </div>

          {/* Teaching Philosophy */}
          <div className={styles.philosophyBox}>
            <h4>Teaching Philosophy & Approach</h4>
            <p>{tutoringData.aboutPhilosophy}</p>
          </div>
        </section>

        {/* Section 2: Subjects & Coursework */}
        <section id="subjects" className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSublabel}>CURRICULUM COVERED</span>
            <h2 className={styles.sectionTitle}>Subjects & Coursework</h2>
            <p className={styles.sectionSubtitle}>
              Comprehensive 1-on-1 tutoring across middle school, high school AP, and college math
            </p>
          </div>

          <div className={styles.subjectsRowContainer}>
            {(tutoringData.subjectCategories || []).map((cat, idx) => (
              <React.Fragment key={cat.id || idx}>
                {idx > 0 && <div className={styles.subjectsRowDivider} />}
                <div className={styles.subjectInlineList}>
                  {(cat.subjects || []).map((sub, sIdx) => (
                    <React.Fragment key={sIdx}>
                      {sIdx > 0 && <span className={styles.subjectDot}>•</span>}
                      <span className={styles.subjectText}>{sub}</span>
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Section 3: Formats, Rates & Offers */}
        <section id="rates-and-formats" className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSublabel}>PRICING & FORMATS</span>
            <h2 className={styles.sectionTitle}>Tutoring Formats & Rates</h2>
            <p className={styles.sectionSubtitle}>
              Flexible instruction available online or in-person across the Peninsula & South Bay
            </p>
          </div>

          <div className={styles.ratesGrid}>
            {/* Online Rate Card */}
            <div className={styles.rateCard}>
              <div className={styles.rateCardHeader}>
                <Monitor size={18} /> Online Session
              </div>
              <div className={styles.ratePrice}>
                {tutoringData.rates.onlineRate}
              </div>
              <p className={styles.rateDesc}>
                {tutoringData.rates.onlineDescription}
              </p>
            </div>

            {/* In-Person Rate Card */}
            <div className={styles.rateCard}>
              <div className={styles.rateCardHeader}>
                <MapPin size={18} /> In-Person Session
              </div>
              <div className={styles.ratePrice}>
                {tutoringData.rates.inPersonRate}
              </div>
              <p className={styles.rateDesc}>
                {tutoringData.rates.inPersonDescription}
              </p>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className={styles.referralBanner}>
            <div className={styles.referralIcon}>
              <Gift size={24} />
            </div>
            <div className={styles.referralContent}>
              <h4>Special Referral Offer</h4>
              <p>{tutoringData.rates.referralOffer}</p>
            </div>
          </div>
        </section>

        {/* Section 4: Student & Parent Testimonials */}
        {(tutoringData.testimonials || []).length > 0 && (
          <section id="testimonials" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionSublabel}>STUDENT FEEDBACK</span>
              <h2 className={styles.sectionTitle}>Student & Parent Feedback</h2>
              <p className={styles.sectionSubtitle}>
                What students and parents say about learning together
              </p>
            </div>

            <div className={styles.testimonialsGrid}>
              {tutoringData.testimonials.map((t) => (
                <div key={t.id} className={styles.testimonialCard}>
                  <p className={styles.quoteText}>"{t.quote}"</p>
                  <div className={styles.authorMeta}>
                    <span className={styles.authorName}>{t.author}</span>
                    <span className={styles.authorContext}>{t.context}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Frequently Asked Questions */}
        <section id="faq" className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSublabel}>COMMON QUESTIONS</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to know before getting started
            </p>
          </div>

          <div className={styles.faqList}>
            {(tutoringData.faqs || []).map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Embedded Google Form Section */}
        <section id="inquiry-form" className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSublabel}>GET IN TOUCH</span>
            <h2 className={styles.sectionTitle}>Tutoring Inquiry & Schedule Request</h2>
            <p className={styles.sectionSubtitle}>
              Fill out the form below to request a session or ask questions.
            </p>
          </div>

          <div className={styles.formNotice}>
            <Mail size={16} />
            <span>
              <strong>Automatic Confirmation:</strong> A complete copy of your submitted responses will be automatically emailed to you for your records.
            </span>
          </div>

          <div className={styles.iframeWrapper}>
            <iframe
              title="Frank Hobson Tutoring Inquiry Form"
              src={tutoringData.googleFormUrl}
              className={styles.formIframe}
            >
              Loading inquiry form...
            </iframe>
          </div>

          <div className={styles.fallbackFormBtn}>
            <a
              href={tutoringData.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
            >
              Open Form in New Tab <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tutoring;
