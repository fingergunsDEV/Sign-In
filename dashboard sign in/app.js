import { store } from './store/index.js';

export function initializeApp() {
  // Check if we're on the landing page
  const isLandingPage = document.querySelector('.hero');
  
  const isDashboard = document.querySelector('.courses-grid');

  if (isLandingPage) {
    // Initialize landing page interactions
    const ctaButtons = document.querySelectorAll('.btn');
    if (ctaButtons) {
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const action = e.target.textContent.toLowerCase();
          
          if (action.includes('trial'))  location.href =   '/signup.html';
          else if (action.includes('demo')) showDemo();
        });
      });
    }

    // Setup smooth scroll
    const navLinks   = document.querySelectorAll('.nav-links a');
    if (navLinks) {  
      navLinks.forEach(link => {    
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) { 
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    // Initialize demo section if exists
    if (document.querySelector('.demo-section')) {
      initializeDemoSection();
    }
    return; 
  } else if (isDashboard) {
    // Initialize menu interactions if exists
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems) {
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const menuId = item.getAttribute('data-id');
          store.dispatch('SET_ACTIVE_MENU', menuId);
        });
      });
    }

    // Initialize search functionality if it exists
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.dispatch('SET_SEARCH_TERM', e.target.value);
      });
    }

    // Subscribe to state changes
    store.subscribe(state => {
      updateUI(state);
    });

    // Initial UI render
    updateUI(store.getState());

    // Initialize demo section if it exists
    if (document.querySelector('.demo-section')) {
      initializeDemoSection();
    }
  }
}

function initializeLandingPage() {
  // Add landing page specific event listeners
  const ctaButtons = document.querySelectorAll('.btn');
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const action = e.target.textContent.toLowerCase();
      
      if (action.includes('trial')) {
        window.location.href = '/signup.html';
      } else if (action.includes('demo')) {
        // Show demo modal or video
        showDemoModal();
      }
    });
  });

  // Initialize smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function showDemoModal() {
  const modal = document.createElement('div');
  modal.className = 'demo-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>Watch Demo</h2>
      <div class="demo-video-placeholder">
        <p>Demo video placeholder</p>
      </div>
      <div class="demo-cta">
        <p>Want to learn more about our platform?</p>
        <button class="btn btn-primary">Schedule a Call</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
  });
}

function updateUI(state) {
  // Check if elements exist before updating
  const activeMenuItem = document.querySelector(`[data-id="${state.activeMenuItem}"]`);
  if (activeMenuItem) {
    updateMenuHighlight(state.activeMenuItem);
  }

  const coursesGrid = document.querySelector('.courses-grid');
  if (!coursesGrid) return;

  switch(state.activeMenuItem) {
    case 'dashboard':
      showDashboard(state, coursesGrid);
      break;
    case 'courses':
      showCourses(state.courses, state.searchTerm, coursesGrid);
      break;
    case 'certificates':
      showCertificates(state, coursesGrid);
      break;
    case 'settings':
      showSettings(state.settings);
      break;
  }
}

function updateMenuHighlight(activeMenuItem) {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-id') === activeMenuItem);
  });
}

function showDashboard(state, container) {
  const inProgressCourses = state.courses.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = state.courses.filter(course => course.progress === 100);

  container.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Course Progress</h3>
          <div class="stat-number">${inProgressCourses.length}</div>
          <p>Courses in progress</p>
        </div>
        <div class="stat-card">
          <h3>Completed</h3>
          <div class="stat-number">${completedCourses.length}</div>
          <p>Courses completed</p>
        </div>
        <div class="stat-card">
          <h3>Total Time</h3>
          <div class="stat-number">${calculateTotalHours(state.courses)}</div>
          <p>Hours of learning</p>
        </div>
      </div>

      <div class="recent-activity">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          ${generateRecentActivity(state.courses)}
        </div>
      </div>

      <div class="recommended-courses">
        <h3>Recommended Next Steps</h3>
        <div class="recommendations">
          ${generateRecommendations(state.courses)}
        </div>
      </div>
    </div>
  `;
}

function showCourses(courses, searchTerm, container) {
  const filteredCourses = filterCourses(courses, searchTerm);
  container.innerHTML = `
    <div class="courses-container">
      <div class="courses-header">
        <h2>My Learning Journey</h2>
        <div class="courses-filters">
          <select class="filter-dropdown">
            <option value="all">All Courses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>
      </div>
      <div class="courses-grid">
        ${filteredCourses.map(course => `
          <div class="course-card">
            <div class="course-image">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
            <div class="course-content">
              <h3 class="course-title">${course.title}</h3>
              <div class="course-info">
                <p>Instructor: ${course.instructor}</p>
                <p>Duration: ${course.duration}</p>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: ${course.progress}%"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function showCertificates(state, container) {
  const certificates = [
    {
      id: 1,
      title: "Holistic SEO Fundamentals",
      instructor: "Sarah Chen",
      issueDate: "2023-09-15",
      validationId: "HSEO-2023-091523",
      skills: ["Technical SEO", "Content Strategy", "Link Building", "SEO Analytics"]
    },
    {
      id: 2,
      title: "Predictive Analytics & Forecasting",
      instructor: "Dr. James Miller",
      issueDate: "2023-10-01",
      validationId: "PAF-2023-100123",
      skills: ["Data Modeling", "Statistical Analysis", "Business Forecasting", "Python"]
    },
    {
      id: 3,
      title: "Business Intelligence Dashboard Design",
      instructor: "Michael Rodriguez",
      issueDate: "2023-08-30",
      validationId: "BID-2023-083023",
      skills: ["Data Visualization", "Dashboard Design", "KPI Development", "Tableau"]
    }
  ];

  container.innerHTML = `
    <div class="certificates-container">
      <div class="certificates-header">
        <h2>My Certificates</h2>
        <p>Showcase your achievements and expertise</p>
        <div class="certificate-filters">
          <button class="filter-btn active" data-filter="all">All Certificates</button>
          <button class="filter-btn" data-filter="recent">Recently Earned</button>
          <button class="filter-btn" data-filter="shared">Shared</button>
        </div>
      </div>

      <div class="certificates-grid">
        ${certificates.map(cert => `
          <div class="certificate-card">
            <div class="certificate-badge">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>
            <div class="certificate-content">
              <h3>${cert.title}</h3>
              <p class="cert-instructor">Instructor: ${cert.instructor}</p>
              <p class="cert-date">Issued: ${new Date(cert.issueDate).toLocaleDateString()}</p>
              <p class="cert-id">ID: ${cert.validationId}</p>
              <div class="cert-skills">
                ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
              <div class="certificate-actions">
                <button class="view-cert-btn">View Certificate</button>
                <div class="share-buttons">
                  <button class="share-btn linkedin" onclick="shareCertificate('${cert.id}', 'linkedin')">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </button>
              <button class="share-btn facebook" onclick="shareCertificate('${cert.id}', 'facebook')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
`;

  // Add event listeners for certificate interactions
  document.querySelectorAll('.view-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Show certificate preview modal
      showCertificatePreview(btn.closest('.certificate-card'));
    });
  });

  // Add filter functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterCertificates(e.target.dataset.filter);
    });
  });
}

function showCertificatePreview(certCard) {
  const modal = document.createElement('div');
  modal.className = 'cert-preview-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="cert-preview">
        ${certCard.innerHTML}
        <div class="cert-additional-info">
          <h4>Verification</h4>
          <p>This certificate can be verified at verify.example.com</p>
          <h4>Course Details</h4>
          <ul>
            <li>Course Duration: 8 weeks</li>
            <li>Completion Date: ${new Date().toLocaleDateString()}</li>
            <li>Grade Achieved: A</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
  });
}

function showSettings(settings) {
  const coursesGrid = document.querySelector('.courses-grid');
  coursesGrid.innerHTML = `
    <div class="settings-container">
      <h2>Settings</h2>
      <div class="settings-group">
        <div class="setting-item">
          <label>
            Theme
            <select id="theme" value="${settings.theme}">
              <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
              <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            </select>
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input type="checkbox" id="notifications" ${settings.notifications ? 'checked' : ''}>
            Enable Notifications
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input type="checkbox" id="emailUpdates" ${settings.emailUpdates ? 'checked' : ''}>
            Receive Email Updates
          </label>
        </div>

        <div class="setting-item">
          <label>
            Language
            <select id="language" value="${settings.language}">
              <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
              <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Spanish</option>
              <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>French</option>
            </select>
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input type="checkbox" id="autoplay" ${settings.autoplay ? 'checked' : ''}>
            Autoplay Videos
          </label>
        </div>
      </div>

      <button class="save-settings">Save Changes</button>
    </div>
  `;

  // Add event listeners for settings changes
  document.querySelector('.save-settings').addEventListener('click', () => {
    const newSettings = {
      theme: document.getElementById('theme').value,
      notifications: document.getElementById('notifications').checked,
      emailUpdates: document.getElementById('emailUpdates').checked,
      language: document.getElementById('language').value,
      autoplay: document.getElementById('autoplay').checked
    };

    store.dispatch('UPDATE_SETTINGS', newSettings);

    // Only try to use Chrome storage if we're in the extension context
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ userSettings: newSettings }).catch(console.error);
    } else {
      // Fallback to localStorage for web context
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
    }
  });
}

function filterCertificates(filter) {
  // Add filter functionality here
}

function updateCourseDisplay(courses, searchTerm) {
  const coursesGrid = document.querySelector('.courses-grid');
  const filteredCourses = filterCourses(courses, searchTerm);

  coursesGrid.innerHTML = filteredCourses.map(course => `
    <div class="course-card">
      <div class="course-image">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      </div>
      <div class="course-content">
        <h3 class="course-title">${course.title}</h3>
        <div class="course-info">
          <p>Instructor: ${course.instructor}</p>
          <p>Duration: ${course.duration}</p>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${course.progress}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCourses(courses, searchTerm) {
  if (!searchTerm) return courses;

  const term = searchTerm.toLowerCase();
  return courses.filter(course => 
    course.title.toLowerCase().includes(term) || 
    course.instructor.toLowerCase().includes(term)
  );
}

function calculateTotalHours(courses) {
  return courses.reduce((total, course) => {
    const weeks = parseInt(course.duration);
    return total + (weeks * 5); // Assuming 5 hours per week
  }, 0);
}

function generateRecentActivity(courses) {
  return courses
    .filter(course => course.progress > 0)
    .slice(0, 5)
    .map(course => `
      <div class="activity-item">
        <div class="activity-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <div class="activity-details">
          <h4>${course.title}</h4>
          <p>Progress: ${course.progress}%</p>
        </div>
      </div>
    `).join('');
}

function generateRecommendations(courses) {
  return courses
    .filter(course => course.progress === 0)
    .slice(0, 3)
    .map(course => `
      <div class="recommendation-item">
        <h4>${course.title}</h4>
        <p>${course.instructor}</p>
        <button class="start-course">Start Learning</button>
      </div>
    `).join('');
}

window.shareCertificate = function(certId, platform) {
  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('I just earned a certificate!')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  };

  window.open(shareUrls[platform], '_blank', 'width=600,height=400');
};

function initializeDemoSection() {
  initializeAnalyticsChart();
  // SEO Tools Demo
  initializeKeywordAnalysis();
  initializeSERPAnalysis();
  
  // Analytics Demo
  initializeMetrics();
  
  // Reports Demo
  initializeReportGeneration();
}

function initializeAnalyticsChart() {
  const ct = document.createElement('script');
  ct.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
  ct.integrity = 'sha256-+8RZJua0a8g2XR4HMr5BZ5IgoQ8EKeczS4OTV7dDK';
  ct.crossorigin = 'anonymous';
  ct.onload = function() {
    const visitorData = {
      labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5'],
      datasets: [
        {
          label: 'Visitors',
          data: [5420, 1240, 16890, 19250, 180],
          borderColor: 'rgb(7, 29, 6)',
          backgroundColor: 'rgba(299, 9, 1)',
          borderWidth: 2
        },
        {
          label: 'Conversions',
          data: [2, 85, 421, 465, 512],
          borderColor: 'rgb(245, 158, 1)',
          backgroundColor: 'rgba(59, 59, 5)',
          borderWidth: 2
        }
      ]
    };

    const options = {
      scales: {
        y: {
          display: true
        }
      }
    };

    const chart = new Chart(
      document.getElementById('ts-chart'),
      {
        type: 'line',
        data: visitorData,
        options: options
      }
    );
  };
  document.head.appendChild(ct);
}

function initializeKeywordAnalysis() {
  const keywords = [
    { term: 'business intelligence tools', volume: 50000, difficulty: 65 },
    { term: 'seo analytics platform', volume: 35000, difficulty: 45 },
    { term: 'predictive analytics software', volume: 28000, difficulty: 55 }
  ];

  const keywordAnalysis = document.querySelector('.keyword-analysis');
  if (!keywordAnalysis) return;

  let currentKeywordIndex = 0;

  function updateKeywordDisplay() {
    const keyword = keywords[currentKeywordIndex];
    keywordAnalysis.innerHTML = `
      <div class="search-box">
        <input type="text" value="${keyword.term}" placeholder="Enter keyword...">
        <button class="analyze-btn">Analyze</button>
      </div>
      <div class="search-volume">
        <span class="label">Monthly Search Volume</span>
        <span class="value">${keyword.volume.toLocaleString()}</span>
      </div>
      <div class="keyword-difficulty">
        <span class="label">Difficulty Score</span>
        <div class="difficulty-meter">
          <div class="bar" style="width: ${keyword.difficulty}%"></div>
          <span class="score">${keyword.difficulty}</span>
        </div>
      </div>
    `;
  }

  updateKeywordDisplay();

  // Add interaction for keyword analysis
  keywordAnalysis.addEventListener('click', (e) => {
    if (e.target.classList.contains('analyze-btn')) {
      currentKeywordIndex = (currentKeywordIndex + 1) % keywords.length;
      updateKeywordDisplay();
    }
  });
}

function initializeSERPAnalysis() {
  const serpData = {
    pageAuthority: 85,
    backlinks: 2300,
    organicTraffic: '15.2K',
    keywordRankings: {
      top3: 28,
      top10: 156,
      top100: 894
    }
  };

  const serpAnalysis = document.querySelector('.serp-preview');
  if (!serpAnalysis) return;

  serpAnalysis.innerHTML = `
    <div class="ranking-factors">
      <div class="factor">
        <span class="factor-name">Page Authority</span>
        <span class="factor-score">${serpData.pageAuthority}</span>
      </div>
      <div class="factor">
        <span class="factor-name">Backlinks</span>
        <span class="factor-score">${serpData.backlinks.toLocaleString()}</span>
      </div>
      <div class="factor">
        <span class="factor-name">Organic Traffic</span>
        <span class="factor-score">${serpData.organicTraffic}</span>
      </div>
      <div class="factor">
        <span class="factor-name">Top 10 Keywords</span>
        <span class="factor-score">${serpData.keywordRankings.top10}</span>
      </div>
    </div>
  `;
}

function initializeMetrics() {
  const metrics = [
    { label: 'Users', value: '125K', trend: '+12.5%' },
    { label: 'Conversion Rate', value: '3.8%', trend: '+0.5%' },
    { label: 'Avg. Session', value: '4:32', trend: '+1:15' }
  ];

  const metricsContainer = document.querySelector('.metrics-container');
  if (!metricsContainer) return;

  metricsContainer.innerHTML = metrics.map(metric => `
    <div class="metric-box">
      <span class="metric-label">${metric.label}</span>
      <span class="metric-value">${metric.value}</span>
      <span class="metric-trend positive">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 4l4 4H4z"/>
        </svg>
        ${metric.trend}
      </span>
    </div>
  `).join('');
}

function initializeReportGeneration() {
  const reportPreview = document.querySelector('.report-preview');
  if (!reportPreview) return;

  const reportSections = [
    'Executive Summary',
    'Traffic Analysis',
    'Conversion Metrics',
    'SEO Performance',
    'Recommendations'
  ];

  reportPreview.innerHTML = `
    <div class="demo-controls">
      ${reportSections.map(section => `
        <button class="control-btn">${section}</button>
      `).join('')}
    </div>
    <div class="report-section">
      <h4>Report Preview</h4>
      <div class="preview-content">
        <div class="summary-preview"></div>
        <div class="metrics-preview"></div>
      </div>
    </div>
  `;

  // Add interaction for report sections
  const controls = reportPreview.querySelectorAll('.control-btn');
  controls.forEach((btn, index) => {
    if (index === 0) btn.classList.add('active');
    
    btn.addEventListener('click', () => {
      controls.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Simulate loading new section
      const previews = reportPreview.querySelectorAll('.preview-content div');
      previews.forEach(preview => {
        preview.style.opacity = 0;
        setTimeout(() => preview.style.opacity = 1, 300);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const demoTabs = document.querySelectorAll('.demo-tab');
  if (demoTabs) {
    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and content
        document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.demo-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const contentId = `${tab.dataset.tab}-demo`;
        document.getElementById(contentId).classList.add('active');
      });
    });
  }

  // Initialize demo section if we're on the landing page
  if (document.querySelector('.demo-section')) {
    initializeDemoSection();
  }
});

function showDemo() {
  // Show demo modal or video
  showDemoModal();
}