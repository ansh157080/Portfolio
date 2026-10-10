/**
 * ANSHU THAKUR - PORTFOLIO JAVASCRIPT
 * Full-Stack Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const projectsContainer = document.getElementById('projectsContainer');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const backToTopBtn = document.getElementById('backToTop');
  const dbStatusBadge = document.getElementById('dbStatusBadge');
  const typingElement = document.getElementById('typingRole');

  // State
  let currentCategory = 'all';
  let cachedProjects = [];

  // =========================================================================
  // 1. TYPING ANIMATION IN HERO SECTION
  // =========================================================================
  const roles = [
    'Computer Engineering Student',
    'Full-Stack Developer (Node & MySQL)',
    'AI / Machine Learning Enthusiast',
    'Thiranex Internship Trainee'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseTime = 1600;

  function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, pauseTime);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 400);
      return;
    }

    const nextSpeed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeEffect, nextSpeed);
  }
  typeEffect();

  // =========================================================================
  // 2. BACKEND & DATABASE HEALTH CHECK
  // =========================================================================
  async function checkServerHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check non-200');
      const data = await res.json();

      if (dbStatusBadge) {
        if (data.database && data.database.status === 'connected') {
          dbStatusBadge.innerHTML = '<span class="status-dot"></span> MySQL Active';
          dbStatusBadge.className = 'db-badge';
          dbStatusBadge.title = `Connected to database: ${data.database.databaseName}`;
        } else {
          dbStatusBadge.innerHTML = '<span class="status-dot"></span> Offline DB';
          dbStatusBadge.className = 'db-badge disconnected';
          dbStatusBadge.title = 'MySQL offline. Serving local seed records.';
        }
      }
    } catch (err) {
      if (dbStatusBadge) {
        dbStatusBadge.innerHTML = '<span class="status-dot"></span> Local Mode';
        dbStatusBadge.className = 'db-badge disconnected';
      }
    }
  }
  checkServerHealth();

  // =========================================================================
  // 3. FETCH AND RENDER PROJECTS FROM EXPRESS REST API
  // =========================================================================
  async function fetchProjects(category = 'all') {
    if (!projectsContainer) return;

    projectsContainer.innerHTML = `
      <div class="projects-loading">
        <div class="spinner"></div>
        <p>Fetching projects from MySQL database...</p>
      </div>
    `;

    try {
      const url = category === 'all' 
        ? '/api/projects' 
        : `/api/projects?category=${encodeURIComponent(category)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      cachedProjects = result.data || [];
      renderProjects(cachedProjects);
    } catch (error) {
      console.warn('API fetch warning:', error);
      projectsContainer.innerHTML = `
        <div class="projects-loading">
          <p style="color: #f87171; margin-bottom: 8px;">⚠️ Could not connect to project API.</p>
          <button class="btn btn-secondary btn-sm" onclick="location.reload()">Retry Connection</button>
        </div>
      `;
    }
  }

  function renderProjects(projects) {
    if (!projectsContainer) return;

    if (!projects || projects.length === 0) {
      projectsContainer.innerHTML = `
        <div class="projects-loading">
          <p>No projects found in this category.</p>
        </div>
      `;
      return;
    }

    const html = projects.map(project => {
      // Split comma separated technologies into styled badges
      const techList = (project.technologies || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`)
        .join('');

      const githubUrl = project.github_url || '#';
      const demoUrl = project.demo_url || '';
      const imageUrl = project.image_url || '/assets/mausam.svg';

      // For Suraksha Kawach project, omit the Live Demo button
      const isSuraksha = (project.title || '').toLowerCase().includes('suraksha');
      const showLiveDemo = Boolean(demoUrl && demoUrl.trim() !== '' && !isSuraksha);

      const liveDemoButton = showLiveDemo ? `
        <a 
          href="${escapeHtml(demoUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="project-btn project-btn-demo"
          title="Open Live Demonstration"
        >
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
        </a>
      ` : '';


      return `
        <article class="project-card" data-category="${escapeHtml(project.category)}">
          <div class="project-thumbnail-wrapper">
            <img 
              src="${escapeHtml(imageUrl)}" 
              alt="${escapeHtml(project.title)}" 
              class="project-thumbnail"
              loading="lazy"
              onerror="this.src='/assets/mausam.svg'"
            />
            <span class="project-category-tag">${escapeHtml(project.category)}</span>
          </div>

          <div class="project-body">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            ${project.subtitle ? `<p class="project-subtitle">${escapeHtml(project.subtitle)}</p>` : ''}
            <p class="project-description">${escapeHtml(project.description)}</p>

            <div class="project-tech-tags">
              ${techList}
            </div>

            <div class="project-actions">
              <a 
                href="${escapeHtml(githubUrl)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="project-btn project-btn-code"
                title="View Source Code Repository"
              >
                <i class="fa-brands fa-github"></i> GitHub
              </a>
              ${liveDemoButton}
            </div>
          </div>
        </article>
      `;
    }).join('');

    projectsContainer.innerHTML = html;
  }

  // Filter Buttons Click Handling
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-filter');
      currentCategory = selectedCategory;
      fetchProjects(selectedCategory);
    });
  });

  // Initial load
  fetchProjects('all');

  // =========================================================================
  // 4. CONTACT FORM SUBMISSION TO MYSQL REST API
  // =========================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear old status
      hideStatus();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic client-side check
      if (!name || !email || !subject || !message) {
        showStatus('error', 'Please fill out all required fields.');
        return;
      }

      // UI Loading State
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to Database...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus('success', `<i class="fa-solid fa-circle-check"></i> ${data.message}`);
          contactForm.reset();
        } else {
          const errMsg = (data.errors && data.errors.join(' ')) || data.message || 'Submission failed.';
          showStatus('error', `<i class="fa-solid fa-circle-exclamation"></i> ${errMsg}`);
        }
      } catch (err) {
        console.error('Contact submission error:', err);
        showStatus('error', '<i class="fa-solid fa-triangle-exclamation"></i> Could not connect to server. Please verify MySQL backend is running.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showStatus(type, msgHtml) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    formStatus.innerHTML = msgHtml;
    formStatus.style.display = 'flex';
  }

  function hideStatus() {
    if (!formStatus) return;
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';
    formStatus.innerHTML = '';
  }

  // =========================================================================
  // 5. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Sticky shadow
    if (scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active Section Detection
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top button action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close menu on link click
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Utility to escape HTML and prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
