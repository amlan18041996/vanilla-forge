import { scrollToTop } from "./utilities/helpers.js";
import { projects } from "./javascript-projects/projects-data.js";
import { tsProjects } from "./typescript-projects/projects-data.js";
import { subjects, topicLabels } from "./javascript-projects/about-data.js";
import demos from "./javascript-projects/project-demos.js";
import { icon, mountIconSprite } from "./icons/index.js";

mountIconSprite();

const allProjects = [...projects, ...tsProjects];

/* ===================== NAVIGATION ===================== */

const navLinks = document.querySelectorAll('#main-nav a');
const pages = {
    home: document.querySelector('#page-home'),
    about: document.querySelector('#page-about'),
    projects: document.querySelector('#page-projects'),
};

function getPath(page, projectId) {
    if (page === 'home') return '/';
    if (page === 'projects') return projectId ? `/projects/${projectId}` : '/projects';
    return `/${page}`;
}

function getRouteFromPath(path) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return { page: 'home', projectId: null };
    if (parts[0] === 'projects') return { page: 'projects', projectId: parts[1] || null };
    if (pages[parts[0]]) return { page: parts[0], projectId: null };
    return { page: 'home', projectId: null };
}

function showPage(page, projectId) {
    Object.entries(pages).forEach(([key, el]) => el.classList.toggle('active', key === page));
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === page));

    if (page === 'projects') {
        if (projectId) showProject(projectId);
        else showProjectsOverview();
    }
}

function navigate(page, projectId) {
    history.pushState({ page, projectId }, '', getPath(page, projectId));
    showPage(page, projectId);
    window.scrollTo(0, 0);
}

navLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    navigate(a.dataset.page);
}));

window.addEventListener('popstate', () => {
    const { page, projectId } = getRouteFromPath(window.location.pathname);
    showPage(page, projectId);
});

/* ===================== HOME STATS ===================== */

/* Stat cards are rendered in index.html; keep the markup there so the home
   page paints before JavaScript runs. */

/* ===================== PROJECT CATEGORIES & NAVIGATION ===================== */

const categoryInfo = {
    javascript: { title: 'JavaScript' },
    typescript: { title: 'TypeScript' },
    libraries: { title: 'Libraries' },
};

function getProject(id) {
    return allProjects.find(p => p.id === id);
}

function projectCardMarkup(p) {
    return `
        <a class="project-card" href="/projects/${p.id}"
           data-project-id="${p.id}"
           style="--project-color:${p.color}">
            <span class="project-card-icon" aria-hidden="true">
                ${icon(p.icon || 'archive', { className: 'icon' })}
            </span>
            <span class="project-card-body">
                <span class="project-card-title">${p.title}</span>
                <span class="project-card-desc">${p.description}</span>
            </span>
            <span class="project-card-footer">
                <span class="project-card-concepts">${p.concepts.length} concepts</span>
                <span class="project-card-cta" aria-hidden="true">View project →</span>
            </span>
        </a>
    `;
}

let activeProjectFilter = 'all';

function renderProjectFilters() {
    const container = document.querySelector('#project-filters');
    if (!container) return;

    const filters = [
        { key: 'all', title: 'All' },
        ...Object.entries(categoryInfo).map(([key, info]) => ({ key, title: info.title })),
    ];

    container.innerHTML = filters.map(({ key, title }) => {
        const count = key === 'all'
            ? allProjects.length
            : allProjects.filter(p => p.category === key).length;
        return `
            <button type="button" class="project-filter" data-filter="${key}"
                    aria-pressed="false">
                <span class="project-filter-label">${title}</span>
                <span class="project-filter-badge">${count}</span>
            </button>
        `;
    }).join('');
}

function applyProjectFilter(filter) {
    activeProjectFilter = filter;

    document.querySelectorAll('.project-filter').forEach(btn => {
        const isActive = btn.dataset.filter === filter;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('.project-group').forEach(group => {
        group.hidden = filter !== 'all' && group.dataset.category !== filter;
    });
}

function renderProjectsOverview() {
    const container = document.querySelector('#project-groups');
    if (!container) return;

    renderProjectFilters();

    container.innerHTML = Object.entries(categoryInfo).map(([key]) => {
        const items = allProjects.filter(p => p.category === key);
        return `
            <section class="project-group" id="project-group-${key}" data-category="${key}">
                <div class="project-card-grid">
                    ${items.map(projectCardMarkup).join('')}
                </div>
            </section>
        `;
    }).join('');

    applyProjectFilter(activeProjectFilter);
}

function initProjects() {
    renderProjectsOverview();

    document.querySelector('#project-filters')?.addEventListener('click', e => {
        const button = e.target.closest('.project-filter');
        if (button) applyProjectFilter(button.dataset.filter);
    });

    document.querySelector('#page-projects')?.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const back = e.target.closest('.project-back-link');
        if (back) {
            e.preventDefault();
            navigate('projects');
            return;
        }

        const card = e.target.closest('.project-card');
        if (card) {
            e.preventDefault();
            navigate('projects', card.dataset.projectId);
        }
    });

    document.querySelector('.project-tabs')?.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (btn) switchTab(btn.dataset.tab);
    });
}

/* ===================== PROJECT VIEWS ===================== */

function showProjectsOverview() {
    document.querySelector('#project-categories').style.display = '';
    document.querySelector('#project-detail-view').style.display = 'none';
    cleanupDemo();
}

function showProject(id) {
    const project = getProject(id);

    if (!project) {
        showProjectsOverview();
        return;
    }

    const info = categoryInfo[project.category];

    document.querySelector('#project-categories').style.display = 'none';
    document.querySelector('#project-detail-view').style.display = '';

    currentProjectId = id;

    document.querySelector('#project-hero').style.setProperty('--project-color', project.color);
    document.querySelector('#detail-icon').innerHTML =
        icon(project.icon || 'archive', { className: 'icon' });
    document.querySelector('#detail-category').textContent = info.title;
    document.querySelector('#detail-title').textContent = project.title;
    document.querySelector('#detail-desc').textContent = project.description;

    document.querySelector('#detail-concepts').innerHTML =
        project.concepts.map(c => `<span class="concept-tag">${c}</span>`).join('');

    const instrEl = document.querySelector('#detail-instructions');
    if (project.instructions) {
        instrEl.style.display = 'block';
        instrEl.className = 'project-instructions';
        instrEl.innerHTML = project.instructions;
    } else {
        instrEl.style.display = 'none';
        instrEl.innerHTML = '';
    }

    const backLink = document.querySelector('#detail-back-link');
    backLink.href = '/projects';
    document.querySelector('#detail-back-label').textContent = 'All projects';

    renderRelatedProjects(project.category, id);
    switchTab('details');

    const inner = document.querySelector('#demo-inner');
    const demo = demos[id];
    inner.innerHTML = demo
        ? demo.html
        : '<p class="text-gray-500 text-center py-8">Demo not available</p>';
    demoInitTracker[id] = false;
}

function renderRelatedProjects(category, id) {
    const info = categoryInfo[category];
    const related = allProjects
        .filter(p => p.category === category && p.id !== id)
        .slice(0, 4);

    const section = document.querySelector('#related-projects');
    if (!related.length) {
        section.style.display = 'none';
        return;
    }

    section.style.display = '';
    document.querySelector('#related-title').textContent =
        `Try other popular projects from ${info.title}`;
    document.querySelector('#related-grid').innerHTML = related.map(projectCardMarkup).join('');
}

/* ===================== PROJECT DETAIL WITH TABS ===================== */

let currentProjectId = null;
let demoInitTracker = {};

function cleanupDemo() {
    currentProjectId = null;
    demoInitTracker = {};
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
    });
    document.querySelectorAll('.tab-panel').forEach(p =>
        p.classList.toggle('active', p.id === `tab-${tab}`));

    if (tab === 'demo' && currentProjectId && !demoInitTracker[currentProjectId]) {
        const project = allProjects.find(p => p.id === currentProjectId);
        if (project) {
            const inner = document.querySelector('#demo-inner');
            const demo = demos[project.id];
            if (demo && demo.init) {
                setTimeout(() => {
                    try { Promise.resolve(demo.init(inner)).catch(() => {}); }
                    catch (e) { console.warn('Demo init error:', e); }
                }, 0);
            }
            demoInitTracker[project.id] = true;
        }
    }
}

/* ===================== SEARCH ===================== */

const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const mobileSearchToggle = document.querySelector('#mobile-search-toggle');
const mobileSearchClose = document.querySelector('#mobile-search-close');
const searchWrapper = document.querySelector('#search-wrapper');
const searchBackdrop = document.querySelector('#search-backdrop');
const header = document.querySelector('header');

function setMobileSearchOpen(isOpen) {
    searchWrapper?.classList.toggle('mobile-open', isOpen);
    searchBackdrop?.classList.toggle('search-backdrop-active', isOpen);
    header?.classList.toggle('mobile-search-active', isOpen);
    mobileSearchToggle?.setAttribute('aria-expanded', String(isOpen));
    searchBackdrop?.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
        setTimeout(() => {
            if (searchWrapper?.classList.contains('mobile-open')) searchInput?.focus();
        }, 350);
    }
    else searchResults?.classList.remove('show');
}

mobileSearchToggle?.addEventListener('click', () => setMobileSearchOpen(true));
mobileSearchClose?.addEventListener('click', () => {
    setMobileSearchOpen(false);
    mobileSearchToggle?.focus();
});
document.querySelector('.mobile-search-submit')?.addEventListener('click', () => {
    searchInput?.dispatchEvent(new Event('input', { bubbles: true }));
});
searchBackdrop?.addEventListener('click', () => {
    setMobileSearchOpen(false);
    mobileSearchToggle?.focus();
});
searchInput?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        setMobileSearchOpen(false);
        mobileSearchToggle?.focus();
    }
});

searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchResults.classList.remove('show'); return; }

    const matches = allProjects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.concepts.some(c => c.toLowerCase().includes(q))
    );

    searchResults.innerHTML = matches.length
        ? matches.map(p => `<div class="result-item" data-id="${p.id}">${p.title}</div>`).join('')
        : '<div class="result-item">No results found</div>';

    searchResults.classList.add('show');
});

searchResults?.addEventListener('click', e => {
    const item = e.target.closest('.result-item');
    if (item && item.dataset.id) {
        navigate('projects', item.dataset.id);
        searchInput.value = '';
        setMobileSearchOpen(false);
    }
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper') && !e.target.closest('.mobile-search-toggle')) {
        searchResults?.classList.remove('show');
        if (window.matchMedia('(max-width: 640px)').matches) setMobileSearchOpen(false);
    }
});

/* ===================== ABOUT ===================== */

function renderSubjectList() {
    const list = document.querySelector('#subject-list');
    const select = document.querySelector('#about-subject-select');
    list.innerHTML = subjects.map(s => `
        <li data-subject="${s.id}">
            ${icon(s.iconName, { className: `subject-icon subject-icon--${s.id}` })}
            ${s.title}
        </li>
    `).join('');
    list.addEventListener('click', e => {
        const li = e.target.closest('li');
        if (li) {
            showSubject(li.dataset.subject);
            select.value = li.dataset.subject;
        }
    });
    select.addEventListener('change', () => {
        if (select.value) showSubject(select.value);
        else showAboutOverview();
    });
}

function renderAboutSectionNav(sections) {
    const nav = document.querySelector('#about-section-links');
    nav.innerHTML = sections.map(({ id, label }) => `
        <button type="button" data-jump="${id}" aria-controls="${id}">${label}</button>
    `).join('');
}

function showAboutOverview() {
    document.querySelectorAll('#subject-list li').forEach(li => li.classList.remove('active'));
    document.querySelector('#about-subject-select').value = '';
    document.querySelector('#about-detail').innerHTML = `
        <div class="subject-header">
            ${icon('javascript', { className: 'subject-icon subject-icon--javascript' })}
            <h3>JavaScript &amp; TypeScript</h3>
            <span class="badge badge-ts">Compare</span>
        </div>
        <section id="about-overview">
            <div class="section-title">Two languages, one ecosystem</div>
            <p class="intro-text">TypeScript builds on JavaScript with a static type system. TypeScript code is checked and compiled to JavaScript, which is what browsers and JavaScript runtimes execute. Choose based on your project's scale, tooling, and need for type checks—not runtime performance.</p>
        </section>
        <section id="about-differences">
            <div class="section-title">Key differences</div>
            <div class="table-wrap">
                <table class="comparison-table">
                    <thead><tr><th scope="col">Aspect</th><th scope="col">JavaScript</th><th scope="col">TypeScript</th></tr></thead>
                    <tbody>
                        <tr><th scope="row">Types</th><td>Dynamic; many type errors appear at runtime.</td><td>Static checks catch many mistakes during development.</td></tr>
                        <tr><th scope="row">Run environment</th><td>Runs directly in browsers and JS runtimes.</td><td>Usually compiled to JavaScript before it runs.</td></tr>
                        <tr><th scope="row">Tooling</th><td>Flexible setup with editor support available.</td><td>Types improve autocomplete, navigation, and refactoring.</td></tr>
                        <tr><th scope="row">Getting started</th><td>No compile step or type definitions required.</td><td>Needs TypeScript configuration and a build/type-check step.</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
        <section id="about-uses">
            <div class="section-title">When to use each</div>
            <div class="language-uses">
                <article class="language-use-card">
                    <h4>JavaScript</h4>
                    <p>Great for browser interactions, small scripts, quick prototypes, and projects where minimal setup matters. It is also the runtime language for web frontends and many server-side applications.</p>
                </article>
                <article class="language-use-card">
                    <h4>TypeScript</h4>
                    <p>Useful for larger or long-lived applications, shared codebases, APIs, and teams that benefit from explicit contracts and compile-time checks. It helps make refactoring and collaboration safer.</p>
                </article>
            </div>
        </section>
    `;
    renderAboutSectionNav([
        { id: 'about-overview', label: 'Overview' },
        { id: 'about-differences', label: 'Key differences' },
        { id: 'about-uses', label: 'When to use each' },
    ]);
}

function showSubject(id) {
    document.querySelectorAll('#subject-list li').forEach(li =>
        li.classList.toggle('active', li.dataset.subject === id));
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;

    document.querySelector('#about-detail').innerHTML = `
        <div class="subject-header">
            ${icon(subject.iconName, { className: `subject-icon subject-icon--${subject.id}` })}
            <h3>${subject.title}</h3>
            <span class="badge ${subject.badgeClass}">${subject.badge}</span>
        </div>

        <section id="about-intro">
            <div class="section-title">Introduction</div>
            <p class="intro-text">${subject.introduction}</p>
        </section>

        <section id="about-history">
            <div class="section-title">History</div>
            <div class="history-text">
                ${subject.history.map(p => `<p>${p}</p>`).join('')}
            </div>
        </section>

        <section id="about-topics">
            <div class="section-title">Topics</div>
            <div class="topics-grid">
                ${Object.entries(subject.topics).map(([level, items]) => `
                    <div class="topic-column">
                        <h4 style="color:${topicLabels[level].color};background:${topicLabels[level].bg}">${topicLabels[level].title}</h4>
                        <ul>
                            ${items.map(t => `<li><strong>${t.name}</strong> — ${t.desc}</li>`).join('')}
                            <li style="color:var(--text-muted);font-style:italic">and more...</li>
                        </ul>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    renderAboutSectionNav([
        { id: 'about-intro', label: 'Introduction' },
        { id: 'about-history', label: 'History' },
        { id: 'about-topics', label: 'Topics' },
    ]);
}

/* ===================== INIT ===================== */

function init() {
    initProjects();
    renderSubjectList();
    showAboutOverview();

    document.querySelector('#about-section-links')?.addEventListener('click', e => {
        const button = e.target.closest('button[data-jump]');
        if (!button) return;
        const target = document.getElementById(button.dataset.jump);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const { page, projectId } = getRouteFromPath(window.location.pathname);
    showPage(page, projectId);

    window.onscroll = function () {
        const scrollTop = document.getElementById('scroll-top');
        if (!scrollTop) return;
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTop.classList.remove('hidden');
            scrollTop.classList.add('flex');
        } else {
            scrollTop.classList.remove('flex');
            scrollTop.classList.add('hidden');
        }
    };
    document.getElementById('scroll-top')?.children[0]?.addEventListener('click', scrollToTop);
}

document.addEventListener('DOMContentLoaded', init);
