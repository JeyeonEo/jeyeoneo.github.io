function createElement(tagName, className, textContent) {
  var element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (typeof textContent === "string") {
    element.textContent = textContent;
  }

  return element;
}

function createNavItem(label, href) {
  var link = createElement("a", "top-nav__link", label);
  link.href = href;
  return link;
}

function createSidebarItem(label, href, kind) {
  var item = createElement("li", "sidebar-list__item");
  var link = createElement("a", "sidebar-list__link", label);

  link.href = href;
  link.setAttribute("data-kind", kind);
  item.appendChild(link);
  return item;
}

function createTag(text, accent) {
  var tag = createElement("span", "tag" + (accent ? " tag--accent" : ""), text);
  return tag;
}

function createExternalLink(href, label) {
  var link = createElement("a", "button-link", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer noopener";
  return link;
}

function appendChildren(parent, children) {
  children.forEach(function (child) {
    if (child) {
      parent.appendChild(child);
    }
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderSidebarList(container, items, mapItem) {
  if (!container) {
    return;
  }

  clearElement(container);

  items.forEach(function (item) {
    var rendered = mapItem(item);

    if (rendered) {
      container.appendChild(rendered);
    }
  });
}

function renderTopNav() {
  var nav = document.getElementById("top-nav-links");

  if (!nav) {
    return;
  }

  clearElement(nav);

  appendChildren(nav, [
    createNavItem("Projects", "#projects"),
    createNavItem("Papers", "#papers"),
    createNavItem("Study", "#study"),
    createNavItem("About", "#about")
  ]);
}

function renderSidebar() {
  var projectsList = document.getElementById("sidebar-projects-list");
  var papersList = document.getElementById("sidebar-papers-list");
  var studiesList = document.getElementById("sidebar-studies-list");

  var isRoot = window.location.pathname === "/" ||
    window.location.pathname.endsWith("/index.html") ||
    !window.location.pathname.includes("/zen_matrix_soft_");
  var base = isRoot ? "" : "../";

  renderSidebarList(projectsList, typeof PROJECTS !== "undefined" ? PROJECTS : [], function (project) {
    return createSidebarItem(project.id || project.title || "Project", base + "zen_matrix_soft_project_hub_toggle_nav_1/code.html", "project");
  });

  renderSidebarList(papersList, typeof PAPERS !== "undefined" ? PAPERS : [], function (paper) {
    return createSidebarItem(paper.filename || paper.title || "Paper", base + "zen_matrix_soft_papers/code.html", "paper");
  });

  renderSidebarList(studiesList, typeof STUDIES !== "undefined" ? STUDIES : [], function (study) {
    if (!study || !study.title || study.title === "-") {
      return null;
    }

    return createSidebarItem(study.sidebar_name || study.title, base + "zen_matrix_soft_study_archive_toggle_nav/code.html", "study");
  });
}

function renderProjects() {
  var container = document.getElementById("projects-grid");

  if (!container || typeof PROJECTS === "undefined") {
    return;
  }

  clearElement(container);

  PROJECTS.forEach(function (project) {
    var card = createElement("article", "card");
    var header = createElement("div", "card__header");
    var title = createElement("h3", "card__title", project.title || project.id || "Untitled project");
    var id = createElement("p", "card__eyebrow", project.id || "PROJECT");
    var body = createElement("div", "card__body");
    var descriptionList = createElement("div", "stack stack--sm");
    var footer = createElement("div", "card__footer");

    appendChildren(header, [id, title]);

    if (Array.isArray(project.tags) && project.tags.length > 0) {
      var tagRow = createElement("div", "tag-row");
      project.tags.forEach(function (tagText, index) {
        tagRow.appendChild(createTag(tagText, index === 0));
      });
      body.appendChild(tagRow);
    }

    if (Array.isArray(project.sections) && project.sections.length > 0) {
      project.sections.forEach(function (section) {
        var block = createElement("section", "detail-block");
        var number = createElement("span", "detail-block__number", section.number || "--");
        var text = createElement(
          "p",
          "detail-block__text" + (section.italic ? " detail-block__text--muted" : ""),
          section.text || ""
        );

        appendChildren(block, [number, text]);
        descriptionList.appendChild(block);
      });
    } else {
      descriptionList.appendChild(
        createElement("p", "card__empty", "Public project details will be added here when they are ready to publish.")
      );
    }

    body.appendChild(descriptionList);

    if (Array.isArray(project.system_info) && project.system_info.length > 0) {
      var systemInfo = createElement("ul", "meta-list");

      project.system_info.forEach(function (entry) {
        systemInfo.appendChild(createElement("li", "meta-list__item", entry));
      });

      footer.appendChild(systemInfo);
    }

    if (project.github_url && project.github_label) {
      footer.appendChild(createExternalLink(project.github_url, project.github_label));
    }

    appendChildren(card, [header, body, footer]);
    container.appendChild(card);
  });
}

function renderPapers() {
  var container = document.getElementById("papers-list");

  if (!container || typeof PAPERS === "undefined") {
    return;
  }

  clearElement(container);

  PAPERS.forEach(function (paper) {
    var item = createElement("article", "paper-item");
    var heading = createElement("div", "paper-item__heading");
    var title = createElement("h3", "paper-item__title", paper.title || paper.filename || "Untitled paper");
    var meta = createElement(
      "p",
      "paper-item__meta",
      [paper.year, paper.venue].filter(Boolean).join(" / ")
    );
    var filename = createElement("p", "paper-item__filename", paper.filename || paper.id || "");

    appendChildren(heading, [title, meta, filename]);
    item.appendChild(heading);

    if (paper.abstract) {
      item.appendChild(createElement("p", "paper-item__abstract", paper.abstract));
    }

    container.appendChild(item);
  });
}

function renderStudies() {
  var container = document.getElementById("study-list");
  var studies = typeof STUDIES === "undefined"
    ? []
    : STUDIES.filter(function (study) {
        return study && study.title && study.title !== "-";
      });

  if (!container) {
    return;
  }

  clearElement(container);

  if (studies.length === 0) {
    container.appendChild(
      createElement("p", "card__empty", "Public study notes are not published yet.")
    );
    return;
  }

  studies.forEach(function (study) {
    var item = createElement("article", "study-item");
    var top = createElement("div", "study-item__top");
    var badge = createTag(study.type || "Study", true);
    var progress = createElement(
      "span",
      "study-item__progress",
      String(typeof study.progress === "number" ? study.progress : 0) + "%"
    );
    var title = createElement("h3", "study-item__title", study.title);
    var description = createElement("p", "study-item__description", study.description || "");

    appendChildren(top, [badge, progress]);
    appendChildren(item, [top, title, description]);

    if (study.url) {
      item.appendChild(createExternalLink(study.url, "View log"));
    }

    container.appendChild(item);
  });
}

function renderAbout() {
  var heading = document.getElementById("about-heading");
  var role = document.getElementById("about-role");
  var contact = document.getElementById("about-contact");
  var bio = document.getElementById("about-bio");
  var timeline = document.getElementById("about-timeline");

  if (typeof ABOUT === "undefined") {
    return;
  }

  if (heading) {
    heading.textContent = ABOUT.display_name || "Profile";
  }

  if (role) {
    role.textContent = ABOUT.role || "";
  }

  if (contact) {
    contact.textContent = ABOUT.location || "";
  }

  if (bio) {
    clearElement(bio);

    (ABOUT.bio || []).forEach(function (paragraph) {
      bio.appendChild(createElement("p", "about-copy__paragraph", paragraph));
    });
  }

  if (timeline) {
    clearElement(timeline);

    (ABOUT.timeline || []).forEach(function (entry) {
      var item = createElement("article", "timeline-item");
      var date = createElement("span", "timeline-item__date", entry.date || "");
      var content = createElement("div", "timeline-item__content");
      var title = createElement("h3", "timeline-item__title", entry.title || "");
      var description = createElement("p", "timeline-item__description", entry.description || "");

      appendChildren(content, [title, description]);
      appendChildren(item, [date, content]);
      timeline.appendChild(item);
    });
  }
}

window.SiteRenderer = {
  renderTopNav: renderTopNav,
  renderSidebar: renderSidebar,
  renderProjects: renderProjects,
  renderPapers: renderPapers,
  renderStudies: renderStudies,
  renderAbout: renderAbout
};
