function createButtonLink(href, label, primary) {
  var link = document.createElement("a");
  link.className = "button-link" + (primary ? " button-link--primary" : "");
  link.href = href;
  link.textContent = label;
  return link;
}

function setupHeroActions() {
  var container = document.getElementById("hero-actions");

  if (!container) {
    return;
  }

  container.appendChild(createButtonLink("#projects", "Browse projects", true));
  container.appendChild(createButtonLink("#about", "Read profile", false));
}

function setupSidebarToggle() {
  var button = document.getElementById("menu-button");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebar-overlay");

  if (!button || !sidebar || !overlay) {
    return;
  }

  function setOpen(isOpen) {
    sidebar.classList.toggle("is-open", isOpen);
    overlay.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  button.addEventListener("click", function () {
    setOpen(!sidebar.classList.contains("is-open"));
  });

  overlay.addEventListener("click", function () {
    setOpen(false);
  });

  sidebar.addEventListener("click", function (event) {
    if (event.target.tagName === "A" && window.innerWidth <= 1024) {
      setOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) {
      setOpen(false);
    }
  });
}

function renderPage() {
  if (!window.SiteRenderer) {
    return;
  }

  window.SiteRenderer.renderTopNav();
  window.SiteRenderer.renderSidebar();
  window.SiteRenderer.renderProjects();
  window.SiteRenderer.renderPapers();
  window.SiteRenderer.renderStudies();
  window.SiteRenderer.renderAbout();
}

document.addEventListener("DOMContentLoaded", function () {
  renderPage();
  setupHeroActions();
  setupSidebarToggle();
});
