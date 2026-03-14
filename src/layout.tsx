export const Layout = (props: { title: string; children: any }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav class="nav">
          <div class="nav-container">
            <a href="/" class="nav-logo">
              HOME_PAGE
            </a>
            <div class="nav-links">
              <a href="/webgpu">WEB_GPU</a>
            </div>
          </div>
        </nav>
        <main class="main-content">
          <div class="content-wrapper">{props.children}</div>
        </main>
        <footer class="footer">
          <div class="footer-links">
            <a
              href="https://www.linkedin.com/in/arnas-liaugaudas-b2355a294/"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
                class="footer-icon"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.368 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Arnas-dev"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
                class="footer-icon"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.368 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
};
