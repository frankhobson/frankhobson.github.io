import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = () => {
  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');
  const srcDataDir = path.join(rootDir, 'src/data');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Load data JSONs
  const homeData = JSON.parse(fs.readFileSync(path.join(srcDataDir, 'home.json'), 'utf8'));
  const experiences = JSON.parse(fs.readFileSync(path.join(srcDataDir, 'experiences.json'), 'utf8'));
  const projects = JSON.parse(fs.readFileSync(path.join(srcDataDir, 'projects.json'), 'utf8'));
  const volunteering = JSON.parse(fs.readFileSync(path.join(srcDataDir, 'volunteering.json'), 'utf8'));

  // 1. Generate robots.txt
  const robotsTxt = `# Allow all search engines and AI web crawlers / LLM agents
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://frankhobson.github.io/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('Generated public/robots.txt');

  // 2. Generate sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://frankhobson.github.io/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://frankhobson.github.io/work</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://frankhobson.github.io/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://frankhobson.github.io/volunteering</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://frankhobson.github.io/travel</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://frankhobson.github.io/tutoring</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  console.log('Generated public/sitemap.xml');

  // 3. Generate public/404.html (GitHub Pages SPA router fallback)
  const html404 = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Portfolio | Frank Hobson</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages SPA Routing
      // Converts requested path e.g. /projects into a query parameter redirect /?/projects
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <p>Redirecting to requested route...</p>
  </body>
</html>
`;
  fs.writeFileSync(path.join(publicDir, '404.html'), html404);
  console.log('Generated public/404.html');

  // 4. Generate llms.txt & llms-full.txt
  const markdownContent = `# Frank Hobson — Portfolio & Professional Background

> ${homeData.heroSubtitle.replace(/&middot;/g, '·')}
> ${homeData.aboutHeadline}

- Location: ${homeData.metaBasedIn}
- Status: ${homeData.metaRole}
- Website: https://frankhobson.github.io/
- GitHub: https://github.com/frankhobson
- LinkedIn: https://www.linkedin.com/in/frank-hobson-835426275/

---

## About Me

${homeData.aboutParagraphs.join('\n\n')}

### Core Skills & Technologies
${homeData.metaSkills}

---

## Education

**University of California, Los Angeles (UCLA)**
- B.A.Sc. in Applied Mathematics and Political Science | GPA 3.8
- Graduation Date: June 2026

---

## Professional Work Experience

${experiences.map(exp => `### ${exp.role} — ${exp.company}
- Location: ${exp.location}
- Dates: ${exp.dates}
${exp.link ? `- Website: ${exp.link}` : ''}
- Key Skills: ${exp.tags.join(', ')}

**Accomplishments:**
${exp.description.map(d => `- ${d}`).join('\n')}
`).join('\n')}

---

## Projects

${projects.map(p => `### ${p.title}
- Subtitle: ${p.subtitle}
- Status: ${p.status === 'completed' ? 'Completed / Active' : 'Work in Progress'}
- Technologies: ${p.techStack.join(', ')}
${p.link ? `- Live URL: ${p.link}` : ''}
${p.githubUrl ? `- Source Code: ${p.githubUrl}` : ''}

${p.description}
`).join('\n')}

---

## Certifications & Licenses

${(homeData.certifications || []).map(c => `- **${c.name}** (${c.issuer}) — ${c.date}${c.credentialId ? ` [Credential ID: ${c.credentialId}]` : ''}${c.link ? ` [Verification: ${c.link}]` : ''}`).join('\n')}

---

## Volunteering & Leadership

${volunteering.map(v => `### ${v.role} — ${v.organization}
- Dates: ${v.dates}
${v.featured ? '- Status: Featured Primary Cause' : ''}
${v.description}

**Achievements:**
${v.achievements.map(a => `- ${a}`).join('\n')}
`).join('\n')}
`;

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), markdownContent);
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), markdownContent);
  console.log('Generated public/llms.txt and public/llms-full.txt');

  // 5. Update index.html pre-rendered static content fallback, GitHub Pages SPA decoder, and JSON-LD schema
  const indexPath = path.join(rootDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // GitHub Pages SPA Redirect Decoder
  const spaRedirectDecoder = `<script type="text/javascript">
      // GitHub Pages SPA Route Decoder
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>`;

  if (!html.includes('GitHub Pages SPA Route Decoder')) {
    html = html.replace('</head>', `    ${spaRedirectDecoder}\n  </head>`);
  }

  // Build JSON-LD Schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://frankhobson.github.io/#person",
        "name": "Frank Hobson",
        "jobTitle": "Quantitative Systems Analyst",
        "description": homeData.aboutHeadline,
        "url": "https://frankhobson.github.io/",
        "sameAs": [
          "https://github.com/frankhobson",
          "https://www.linkedin.com/in/frank-hobson-835426275/"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "University of California, Los Angeles (UCLA)",
          "sameAs": "https://www.ucla.edu"
        },
        "knowsAbout": [
          "Applied Mathematics",
          "Political Science",
          "Quantitative Analysis",
          "Capacity Planning",
          "Forecasting",
          "Python",
          "R",
          "C++",
          "JavaScript",
          "Machine Learning"
        ],
        "worksFor": experiences.map(exp => ({
          "@type": "Organization",
          "name": exp.company,
          "sameAs": exp.link || undefined
        }))
      },
      {
        "@type": "WebSite",
        "@id": "https://frankhobson.github.io/#website",
        "url": "https://frankhobson.github.io/",
        "name": "Portfolio | Frank Hobson",
        "description": "Quantitative systems analyst bridging applied mathematics, policy analysis, and operations leadership.",
        "author": {
          "@id": "https://frankhobson.github.io/#person"
        }
      }
    ]
  };

  const jsonLdTag = `<script type="application/ld+json">\n${JSON.stringify(jsonLdSchema, null, 2)}\n    </script>`;

  // Replace or insert JSON-LD tag in head
  if (html.includes('<script type="application/ld+json">')) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, jsonLdTag);
  } else {
    html = html.replace('</head>', `    ${jsonLdTag}\n  </head>`);
  }

  // Pre-rendered semantic HTML container inside <div id="root">
  const staticRootHtml = `<div id="root">
      <!-- Static SEO & AI Fallback Content (Hydrated by React on load) -->
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
        <header>
          <h1>Frank Hobson</h1>
          <p><strong>Quantitative Systems Analyst</strong> — ${homeData.aboutHeadline}</p>
          <p>Based in ${homeData.metaBasedIn} | ${homeData.metaRole}</p>
          <p>Links: <a href="https://github.com/frankhobson">GitHub</a> | <a href="https://www.linkedin.com/in/frank-hobson-835426275/">LinkedIn</a> | <a href="https://frankhobson.github.io/llms.txt">llms.txt (AI summary)</a></p>
        </header>
        <hr />
        <main>
          <section id="about">
            <h2>About Me</h2>
            ${homeData.aboutParagraphs.map(p => `<p>${p}</p>`).join('\n            ')}
            <p><strong>Skills & Technologies:</strong> ${homeData.metaSkills}</p>
          </section>
          
          <section id="education">
            <h2>Education</h2>
            <h3>University of California, Los Angeles (UCLA)</h3>
            <p>B.A.Sc. in Applied Mathematics and Political Science | GPA 3.8 (June 2026)</p>
          </section>

          <section id="work">
            <h2>Work Experience</h2>
            ${experiences.map(exp => `
            <article>
              <h3>${exp.role} — ${exp.company}</h3>
              <p><em>${exp.location} | ${exp.dates}</em></p>
              <ul>
                ${exp.description.map(d => `<li>${d}</li>`).join('\n                ')}
              </ul>
              <p><small>Tags: ${exp.tags.join(', ')}</small></p>
            </article>`).join('')}
          </section>

          <section id="projects">
            <h2>Projects</h2>
            ${projects.map(p => `
            <article>
              <h3>${p.title} (${p.subtitle})</h3>
              <p>${p.description}</p>
              <p><small>Technologies: ${p.techStack.join(', ')}</small></p>
              ${p.link ? `<p><a href="${p.link}">View Live Project</a></p>` : ''}
              ${p.githubUrl ? `<p><a href="${p.githubUrl}">Source Code</a></p>` : ''}
            </article>`).join('')}
          </section>

          <section id="certifications">
            <h2>Certifications</h2>
            <ul>
              ${(homeData.certifications || []).map(c => `<li><strong>${c.name}</strong> — ${c.issuer} (${c.date})</li>`).join('\n              ')}
            </ul>
          </section>

          <section id="volunteering">
            <h2>Volunteering & Leadership</h2>
            ${volunteering.map(v => `
            <article>
              <h3>${v.role} — ${v.organization}</h3>
              <p><em>${v.dates}</em></p>
              <p>${v.description}</p>
              <ul>
                ${v.achievements.map(a => `<li>${a}</li>`).join('\n                ')}
              </ul>
            </article>`).join('')}
          </section>
        </main>
      </div>
    </div>`;

  // Replace <div id="root">...</div> in index.html
  html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/, `${staticRootHtml}\n    <script type="module"`);

  fs.writeFileSync(indexPath, html);
  console.log('Updated index.html with static pre-rendered fallback HTML, SPA decoder, and JSON-LD schema');

  // 6. Generate dist/ route copies if dist/ directory exists (post-build helper)
  if (fs.existsSync(distDir)) {
    const distIndexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(distIndexPath)) {
      const ROUTE_META = {
        work: {
          title: "Work Experience | Frank Hobson",
          description: "Professional software engineering, quantitative systems analysis, and research experience of Frank Hobson."
        },
        projects: {
          title: "Projects | Frank Hobson",
          description: "Featured software, game development, and mathematical modeling projects by Frank Hobson."
        },
        travel: {
          title: "Travel | Frank Hobson",
          description: "Interactive travel map and trip highlights across 23 countries and 37 US states."
        },
        volunteering: {
          title: "Volunteering & Leadership | Frank Hobson",
          description: "Community involvement, coaching, and volunteer leadership activities of Frank Hobson."
        },
        tutoring: {
          title: "Tutoring | Frank Hobson",
          description: "Personalized 1-on-1 private mathematics instruction spanning middle school, high school, and undergraduate coursework by UCLA graduate Frank Hobson."
        },
        admin: {
          title: "Admin Dashboard | Frank Hobson",
          description: "Local administration and content management dashboard."
        }
      };

      const routes = Object.keys(ROUTE_META);
      const distIndexHtml = fs.readFileSync(distIndexPath, 'utf8');

      // Copy 404.html into dist
      fs.writeFileSync(path.join(distDir, '404.html'), html404);

      routes.forEach(route => {
        const routeFolder = path.join(distDir, route);
        if (!fs.existsSync(routeFolder)) {
          fs.mkdirSync(routeFolder, { recursive: true });
        }
        const meta = ROUTE_META[route] || { title: "Frank Hobson", description: "Personal Website of Frank Hobson" };
        let routeHtml = distIndexHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
          .replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${meta.title}" />`)
          .replace(/<meta property="twitter:title" content="[\s\S]*?" \/>/, `<meta property="twitter:title" content="${meta.title}" />`)
          .replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${meta.description}" />`)
          .replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${meta.description}" />`)
          .replace(/<meta property="twitter:description" content="[\s\S]*?" \/>/, `<meta property="twitter:description" content="${meta.description}" />`);

        fs.writeFileSync(path.join(routeFolder, 'index.html'), routeHtml);
      });
      console.log(`Generated dist/ route copies with custom titles & link preview metadata for: ${routes.join(', ')}`);
    }
  }
};

run();
