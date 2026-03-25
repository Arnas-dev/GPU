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
              <img
                src="/linkedin.svg"
                alt="LinkedIn"
                width="16"
                height="16"
                class="footer-icon"
              />
              LinkedIn
            </a>
            <a
              href="https://github.com/Arnas-dev"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              <img
                src="/github.svg"
                alt="GitHub"
                width="16"
                height="16"
                class="footer-icon"
              />
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
};
