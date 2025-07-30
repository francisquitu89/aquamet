// Aquamet Production Control Center - Updated Main Application
import './style.css'

class AquametDashboard {
  constructor() {
    this.currentSection = 'dashboard';
    this.sidebarCollapsed = false;
    this.isMobile = window.innerWidth <= 1024;
    this.sidebarOpen = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDateTime();
    this.updateLastUpdate();
    this.startRealTimeUpdates();
    this.handleResponsive();
    this.initializeDashboard();
    
    // Initialize with dashboard section
    this.showSection('dashboard');
  }

  setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        if (section) {
          this.showSection(section);
          this.setActiveNavItem(e.currentTarget);
          
          // Close sidebar on mobile after selection
          if (this.isMobile) {
            this.closeSidebar();
          }
        }
      });
    });

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        this.showNotificationsModal();
      });
    }

    // Setup dashboard specific events
    this.setupDashboardEvents();
    
    // Setup department tabs events
    this.setupDepartmentTabs();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResponsive();
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (this.isMobile && this.sidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          this.closeSidebar();
        }
      }
    });

    // Prevent sidebar close when clicking inside
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupDashboardEvents() {
    // Refresh dashboard button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshDashboard();
      });
    }

    // Week navigation
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
    if (prevWeekBtn) {
      prevWeekBtn.addEventListener('click', () => {
        this.navigateWeek(-1);
      });
    }
    
    if (nextWeekBtn) {
      nextWeekBtn.addEventListener('click', () => {
        this.navigateWeek(1);
      });
    }

    // Alert actions
    const alertBtns = document.querySelectorAll('.alert-btn');
    alertBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleAlertAction(e.target);
      });
    });

    // View all alerts
    const viewAllAlertsBtn = document.querySelector('.view-all-alerts');
    if (viewAllAlertsBtn) {
      viewAllAlertsBtn.addEventListener('click', () => {
        this.showAllAlerts();
      });
    }

    // Chart period selector
    const chartPeriod = document.querySelector('.chart-period');
    if (chartPeriod) {
      chartPeriod.addEventListener('change', (e) => {
        this.updateWorkloadChart(e.target.value);
      });
    }

    // Chart segments click events
    const chartSegments = document.querySelectorAll('.chart-segment');
    chartSegments.forEach((segment, index) => {
      segment.addEventListener('click', () => {
        this.showProjectDetails(index);
      });
      segment.style.cursor = 'pointer';
    });

    // Metric cards click events
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showMetricDetails(index);
      });
      card.style.cursor = 'pointer';
    });

    // Workload bars click events
    const workloadBars = document.querySelectorAll('.workload-bar');
    workloadBars.forEach((bar, index) => {
      bar.addEventListener('click', () => {
        this.showDepartmentDetails(index);
      });
      bar.style.cursor = 'pointer';
    });

    // Timeline items click events
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.showMilestoneDetails(index);
      });
      item.style.cursor = 'pointer';
    });

    // Personnel info click event
    const personnelInfo = document.querySelector('.personnel-info');
    if (personnelInfo) {
      personnelInfo.addEventListener('click', () => {
        this.showPersonnelDetails();
      });
      personnelInfo.style.cursor = 'pointer';
    }

    // Widget toggle functionality
    this.setupWidgetToggles();
  }

  setupWidgetToggles() {
    // Add minimize/maximize functionality to widgets
    const widgets = document.querySelectorAll('.dashboard-widget');
    widgets.forEach(widget => {
      const header = widget.querySelector('.widget-header');
      if (header) {
        // Add toggle button to header
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '<i class="bi bi-dash-square"></i>';
        toggleBtn.className = 'widget-toggle';
        toggleBtn.style.cssText = `
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        `;
        
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleWidget(widget);
        });
        
        toggleBtn.addEventListener('mouseenter', () => {
          toggleBtn.style.background = 'rgba(0,0,0,0.1)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
          toggleBtn.style.background = 'none';
        });
        
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.appendChild(toggleBtn);
      }
    });
  }

  toggleWidget(widget) {
    const content = widget.querySelector('.widget-content, .chart-container, .alerts-content, .workload-content, .metrics-grid, .personnel-content');
    const toggleBtn = widget.querySelector('.widget-toggle i');
    
    if (content) {
      const isMinimized = content.style.display === 'none';
      
      if (isMinimized) {
        content.style.display = '';
        toggleBtn.className = 'bi bi-dash-square';
        widget.style.height = '';
      } else {
        content.style.display = 'none';
        toggleBtn.className = 'bi bi-plus-square';
        widget.style.height = 'auto';
      }
    }
  }

  showProjectDetails(segmentIndex) {
    const projectTypes = ['A Tiempo', 'En Riesgo', 'Retrasados'];
    const projectCounts = [15, 6, 3];
    const selectedType = projectTypes[segmentIndex];
    const count = projectCounts[segmentIndex];
    
    this.showDetailModal(`Proyectos ${selectedType}`, `
      <div class="project-details">
        <h4>${count} proyectos ${selectedType.toLowerCase()}</h4>
        <div class="project-list">
          ${this.generateProjectList(selectedType, count)}
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" onclick="dashboard.viewProjectsSection()">
            Ver Todos los Proyectos
          </button>
        </div>
      </div>
    `);
  }

  generateProjectList(type, count) {
    const projects = [
      'Casco Buque Tanquero #001',
      'Sistema Eléctrico Pesquero #045',
      'Soldadura Estructural #023',
      'Pintura Casco #067',
      'Instalación Motores #012',
      'Sistema Navegación #089'
    ];
    
    let html = '<ul class="list-unstyled">';
    for (let i = 0; i < Math.min(count, 6); i++) {
      const statusIcon = type === 'A Tiempo' ? 'check-circle text-success' : 
                        type === 'En Riesgo' ? 'exclamation-triangle text-warning' : 
                        'x-circle text-danger';
      html += `
        <li class="d-flex align-items-center mb-2">
          <i class="bi bi-${statusIcon} me-2"></i>
          <span>${projects[i] || `Proyecto ${i + 1}`}</span>
        </li>
      `;
    }
    html += '</ul>';
    return html;
  }

  showMetricDetails(metricIndex) {
    const metrics = [
      { name: 'Productividad', value: '94%', desc: 'Rendimiento general de producción' },
      { name: 'Calidad', value: '98%', desc: 'Cumplimiento de estándares de calidad' },
      { name: 'Seguridad', value: '0 incidentes', desc: 'Registro de seguridad laboral' },
      { name: 'Eficiencia', value: '89%', desc: 'Uso óptimo de recursos' }
    ];
    
    const metric = metrics[metricIndex];
    this.showDetailModal(`Métrica: ${metric.name}`, `
      <div class="metric-details">
        <div class="metric-value-large">${metric.value}</div>
        <p class="metric-description">${metric.desc}</p>
        <div class="metric-chart">
          <canvas id="metricChart" width="300" height="150"></canvas>
        </div>
      </div>
    `);
  }

  showDepartmentDetails(deptIndex) {
    const departments = ['Ingeniería', 'Obras Civiles', 'Naval', 'Eléctrico'];
    const workloads = [
      { current: 23, max: 27, efficiency: '85%' },
      { current: 19, max: 20, efficiency: '95%' },
      { current: 21, max: 30, efficiency: '70%' },
      { current: 12, max: 20, efficiency: '60%' }
    ];
    
    const dept = departments[deptIndex];
    const workload = workloads[deptIndex];
    
    this.showDetailModal(`Departamento: ${dept}`, `
      <div class="department-details">
        <h4>Carga de Trabajo Actual</h4>
        <div class="workload-summary">
          <div class="row">
            <div class="col-md-4">
              <div class="stat-card">
                <div class="stat-value">${workload.current}</div>
                <div class="stat-label">Proyectos Activos</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card">
                <div class="stat-value">${workload.max}</div>
                <div class="stat-label">Capacidad Máxima</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card">
                <div class="stat-value">${workload.efficiency}</div>
                <div class="stat-label">Eficiencia</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" onclick="dashboard.viewDepartmentSection('${dept.toLowerCase()}')">
            Ver Detalles del Departamento
          </button>
        </div>
      </div>
    `);
  }

  showMilestoneDetails(itemIndex) {
    const milestones = [
      { title: 'Entrega Casco Buque #001', date: '15 Dic', status: 'urgent' },
      { title: 'Revisión Sistema Eléctrico', date: '16 Dic', status: 'normal' },
      { title: 'Pruebas de Navegación', date: '17 Dic', status: 'normal' },
      { title: 'Inspección Final #045', date: '18 Dic', status: 'important' },
      { title: 'Entrega Cliente Marina', date: '20 Dic', status: 'urgent' }
    ];
    
    const milestone = milestones[itemIndex];
    this.showDetailModal(`Milestone: ${milestone.title}`, `
      <div class="milestone-details">
        <h4>${milestone.title}</h4>
        <p><strong>Fecha:</strong> ${milestone.date}</p>
        <p><strong>Estado:</strong> <span class="badge badge-${milestone.status}">${milestone.status}</span></p>
        <div class="milestone-actions mt-3">
          <button class="btn btn-success me-2">Marcar Completado</button>
          <button class="btn btn-warning me-2">Reprogramar</button>
          <button class="btn btn-info">Ver Detalles</button>
        </div>
      </div>
    `);
  }

  showPersonnelDetails() {
    this.showDetailModal('Personal Activo', `
      <div class="personnel-details">
        <h4>Distribución de Personal</h4>
        <div class="personnel-breakdown">
          <div class="row">
            <div class="col-md-3">
              <div class="personnel-stat">
                <div class="personnel-count">23</div>
                <div class="personnel-dept">Ingeniería</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="personnel-stat">
                <div class="personnel-count">19</div>
                <div class="personnel-dept">Obras Civiles</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="personnel-stat">
                <div class="personnel-count">21</div>
                <div class="personnel-dept">Naval</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="personnel-stat">
                <div class="personnel-count">12</div>
                <div class="personnel-dept">Eléctrico</div>
              </div>
            </div>
          </div>
        </div>
        <div class="attendance-info mt-3">
          <h5>Estado de Asistencia</h5>
          <div class="attendance-stats">
            <span class="badge bg-success me-2">89 Presentes</span>
            <span class="badge bg-warning me-2">4 Tardanzas</span>
            <span class="badge bg-danger">2 Ausencias</span>
          </div>
        </div>
      </div>
    `);
  }

  showDetailModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('detailModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'detailModal';
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" onclick="dashboard.closeDetailModal()"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="dashboard.closeDetailModal()">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeDetailModal();
      }
    });
  }

  closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
      modal.remove();
    }
  }

  viewProjectsSection() {
    this.closeDetailModal();
    this.showSection('projects');
    this.setActiveNavItem(document.querySelector('[data-section="projects"]'));
  }

  viewDepartmentSection(deptName) {
    this.closeDetailModal();
    this.showSection(deptName);
    this.setActiveNavItem(document.querySelector(`[data-section="${deptName}"]`));
  }

  setupDepartmentTabs() {
    // Setup tab functionality for all department sections
    const departmentSections = ['engineering', 'civil-works', 'naval', 'electrical'];
    
    departmentSections.forEach(section => {
      this.setupTabsForSection(section);
    });
  }

  setupTabsForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const tabButtons = section.querySelectorAll('.tab-button');
    const tabPanes = section.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes in this section
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding tab pane
        const targetPane = section.querySelector(`#${tabId}-tab`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
        
        // Trigger tab-specific initialization if needed
        this.onTabActivated(sectionId, tabId);
      });
    });
  }

  onTabActivated(sectionId, tabId) {
    console.log(`Tab activated: ${tabId} in section: ${sectionId}`);
    
    // Handle specific tab activations
    switch (tabId) {
      case 'projects':
        this.initializeProjectsTab(sectionId);
        break;
      case 'gantt':
        this.initializeGanttTab(sectionId);
        break;
      case 'documentation':
        this.initializeDocumentationTab(sectionId);
        break;
      case 'team':
        this.initializeTeamTab(sectionId);
        break;
    }
  }

  initializeProjectsTab(sectionId) {
    // Initialize projects view for the specific department
    console.log(`Initializing projects tab for ${sectionId}`);
    
    // Setup project card interactions
    const section = document.getElementById(sectionId);
    if (!section) return;

    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      // Add hover effects and click handlers
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.project-actions')) {
          this.showProjectDetails(sectionId, index);
        }
      });
    });

    // Setup filter functionality
    const filterSelects = section.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', () => {
        this.filterProjects(sectionId);
      });
    });
  }

  initializeGanttTab(sectionId) {
    console.log(`Initializing Gantt tab for ${sectionId}`);
    // Future: Load Gantt chart component
  }

  initializeDocumentationTab(sectionId) {
    console.log(`Initializing documentation tab for ${sectionId}`);
    // Future: Load document management interface
  }

  initializeTeamTab(sectionId) {
    console.log(`Initializing team tab for ${sectionId}`);
    // Future: Load team management interface
  }

  showProjectDetails(sectionId, projectIndex) {
    // Show detailed view of a specific project
    const projectData = this.getProjectData(sectionId, projectIndex);
    
    this.showDetailModal(`Proyecto: ${projectData.name}`, `
      <div class="project-detail-view">
        <div class="project-header-detail">
          <h4>${projectData.name}</h4>
          <span class="project-code">${projectData.code}</span>
        </div>
        
        <div class="project-status-detail">
          <div class="status-item">
            <span class="label">Estado:</span>
            <span class="status-badge ${projectData.status}">${projectData.statusText}</span>
          </div>
          <div class="status-item">
            <span class="label">Prioridad:</span>
            <span class="priority-badge ${projectData.priority}">${projectData.priorityText}</span>
          </div>
          <div class="status-item">
            <span class="label">Progreso:</span>
            <div class="progress-bar-detail">
              <div class="progress-fill" style="width: ${projectData.progress}%"></div>
            </div>
            <span class="progress-text">${projectData.progress}%</span>
          </div>
        </div>
        
        <div class="project-details-expanded">
          <div class="detail-section">
            <h5>Información General</h5>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Responsable:</span>
                <span class="value">${projectData.responsible}</span>
              </div>
              <div class="detail-item">
                <span class="label">Próximo Hito:</span>
                <span class="value">${projectData.nextMilestone}</span>
              </div>
              <div class="detail-item">
                <span class="label">Tiempo Restante:</span>
                <span class="value">${projectData.timeRemaining}</span>
              </div>
              <div class="detail-item">
                <span class="label">Departamento:</span>
                <span class="value">${this.getDepartmentName(sectionId)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-actions-detail">
          <button class="btn btn-primary">Editar Proyecto</button>
          <button class="btn btn-secondary">Ver Cronograma</button>
          <button class="btn btn-info">Documentos</button>
        </div>
      </div>
    `);
  }

  getProjectData(sectionId, projectIndex) {
    // Mock project data - in real app this would come from API
    const projectsData = {
      engineering: [
        {
          name: 'Diseño Estructural Buque Tanquero TK-001',
          code: 'ENG-2024-001',
          status: 'on-time',
          statusText: 'A Tiempo',
          priority: 'high',
          priorityText: 'Alta',
          progress: 75,
          responsible: 'Ing. María González',
          nextMilestone: 'Revisión Planos - 2 Ago 2025',
          timeRemaining: '45 días'
        },
        {
          name: 'Especificaciones Sistema Propulsión PQ-045',
          code: 'ENG-2024-002',
          status: 'at-risk',
          statusText: 'En Riesgo',
          priority: 'medium',
          priorityText: 'Media',
          progress: 60,
          responsible: 'Ing. Roberto Silva',
          nextMilestone: 'Entrega Especificaciones - 5 Ago 2025',
          timeRemaining: '6 días'
        },
        {
          name: 'Análisis Estructural Dique Seco #2',
          code: 'ENG-2024-003',
          status: 'delayed',
          statusText: 'Atrasado',
          priority: 'high',
          priorityText: 'Alta',
          progress: 45,
          responsible: 'Ing. Ana Torres',
          nextMilestone: 'Reporte Análisis - 1 Ago 2025',
          timeRemaining: '2 días (Retrasado)'
        }
      ]
    };
    
    return projectsData[sectionId]?.[projectIndex] || {};
  }

  getDepartmentName(sectionId) {
    const names = {
      'engineering': 'Ingeniería',
      'civil-works': 'Obras Civiles',
      'naval': 'Naval',
      'electrical': 'Eléctrico'
    };
    return names[sectionId] || sectionId;
  }

  filterProjects(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const filterSelects = section.querySelectorAll('.filter-select');
    const projectCards = section.querySelectorAll('.project-card');
    
    const statusFilter = filterSelects[0]?.value || 'all';
    const priorityFilter = filterSelects[1]?.value || 'all';
    
    projectCards.forEach(card => {
      let showCard = true;
      
      // Status filter
      if (statusFilter !== 'all') {
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge && !statusBadge.classList.contains(statusFilter)) {
          showCard = false;
        }
      }
      
      // Priority filter
      if (priorityFilter !== 'all') {
        const priorityBadge = card.querySelector('.priority-badge');
        if (priorityBadge && !priorityBadge.classList.contains(priorityFilter)) {
          showCard = false;
        }
      }
      
      // Show/hide card with animation
      if (showCard) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  initializeDashboard() {
    this.updateLastUpdate();
    this.animateCharts();
    this.currentWeekOffset = 0;
  }

  refreshDashboard() {
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
      // Add spinning animation
      const icon = refreshBtn.querySelector('i');
      icon.style.animation = 'spin 1s linear infinite';
      
      // Simulate data refresh
      setTimeout(() => {
        this.updateLastUpdate();
        this.updateDashboardData();
        icon.style.animation = '';
      }, 1000);
    }
  }

  updateDashboardData() {
    // Simulate random data updates
    this.updateProjectChart();
    this.updateWorkloadBars();
    this.updateMetrics();
    this.updateAlertCount();
  }

  updateProjectChart() {
    // Simulate project status changes
    const total = 24;
    const onTime = Math.floor(Math.random() * 5) + 13; // 13-17
    const atRisk = Math.floor(Math.random() * 3) + 5;  // 5-7
    const delayed = total - onTime - atRisk;

    // Update legend values
    const legendItems = document.querySelectorAll('.legend-value');
    if (legendItems.length >= 3) {
      legendItems[0].textContent = onTime;
      legendItems[1].textContent = atRisk;
      legendItems[2].textContent = delayed;
    }

    // Update chart segments (simplified animation)
    this.animateChartSegments(onTime, atRisk, delayed);
  }

  animateChartSegments(onTime, atRisk, delayed) {
    const total = onTime + atRisk + delayed;
    const circumference = 2 * Math.PI * 40; // radius = 40
    
    const onTimeLength = (onTime / total) * circumference;
    const atRiskLength = (atRisk / total) * circumference;
    const delayedLength = (delayed / total) * circumference;

    const segments = document.querySelectorAll('.chart-segment');
    if (segments.length >= 3) {
      segments[0].style.strokeDasharray = `${onTimeLength} ${circumference}`;
      segments[1].style.strokeDasharray = `${atRiskLength} ${circumference}`;
      segments[1].style.strokeDashoffset = `-${onTimeLength}`;
      segments[2].style.strokeDasharray = `${delayedLength} ${circumference}`;
      segments[2].style.strokeDashoffset = `-${onTimeLength + atRiskLength}`;
    }
  }

  updateWorkloadBars() {
    const bars = document.querySelectorAll('.bar-fill');
    const values = document.querySelectorAll('.workload-value');
    
    const workloads = [
      { current: Math.floor(Math.random() * 5) + 21, max: 27 }, // Engineering
      { current: Math.floor(Math.random() * 3) + 18, max: 20 }, // Civil
      { current: Math.floor(Math.random() * 8) + 20, max: 30 }, // Naval
      { current: Math.floor(Math.random() * 6) + 10, max: 20 }  // Electrical
    ];

    workloads.forEach((workload, index) => {
      if (bars[index] && values[index]) {
        const percentage = (workload.current / workload.max) * 100;
        bars[index].style.width = `${percentage}%`;
        values[index].textContent = `${workload.current}/${workload.max}`;
      }
    });

    // Update summary
    const totalCurrent = workloads.reduce((sum, w) => sum + w.current, 0);
    const totalMax = workloads.reduce((sum, w) => sum + w.max, 0);
    const utilization = Math.round((totalCurrent / totalMax) * 100);

    const summaryValues = document.querySelectorAll('.summary-value');
    if (summaryValues.length >= 3) {
      summaryValues[0].textContent = totalCurrent;
      summaryValues[1].textContent = totalMax;
      summaryValues[2].textContent = `${utilization}%`;
    }
  }

  updateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    const metrics = [
      Math.floor(Math.random() * 8) + 90,  // Productivity
      Math.floor(Math.random() * 4) + 96,  // Quality
      Math.floor(Math.random() * 3),       // Safety incidents
      Math.floor(Math.random() * 10) + 85  // Efficiency
    ];

    metricValues.forEach((element, index) => {
      if (element && metrics[index] !== undefined) {
        element.textContent = index === 2 ? metrics[index] : `${metrics[index]}%`;
        
        // Add animation
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--accent-blue)';
        
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          element.style.color = '';
        }, 300);
      }
    });
  }

  updateAlertCount() {
    const alertCountElement = document.getElementById('criticalAlertsCount');
    if (alertCountElement) {
      const currentCount = parseInt(alertCountElement.textContent) || 0;
      const newCount = Math.max(0, currentCount + (Math.random() > 0.7 ? 1 : -1));
      alertCountElement.textContent = newCount;
    }
  }

  navigateWeek(direction) {
    this.currentWeekOffset += direction;
    const currentWeekElement = document.querySelector('.current-week');
    
    if (currentWeekElement) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + (this.currentWeekOffset * 7));
      
      const startDate = new Date(baseDate);
      startDate.setDate(startDate.getDate() - baseDate.getDay() + 1); // Monday
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // Sunday
      
      const formatDate = (date) => {
        return `${date.getDate()} ${date.toLocaleDateString('es-ES', { month: 'short' })}`;
      };
      
      currentWeekElement.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  }

  handleAlertAction(button) {
    const alertItem = button.closest('.alert-item');
    const action = button.textContent.trim();
    
    if (alertItem) {
      // Add visual feedback
      button.style.background = 'var(--status-operational)';
      button.style.color = 'var(--white)';
      button.textContent = action === 'Ver Detalles' ? 'Visto' : 'Procesado';
      
      setTimeout(() => {
        if (action !== 'Ver Detalles') {
          alertItem.style.opacity = '0.5';
          alertItem.style.transform = 'translateX(20px)';
          
          setTimeout(() => {
            alertItem.style.display = 'none';
            this.updateAlertCount();
          }, 300);
        }
      }, 1000);
    }
  }

  showAllAlerts() {
    // Navigate to a dedicated alerts section (future implementation)
    console.log('Navigating to all alerts view...');
    // For now, show the notifications modal
    this.showNotificationsModal();
  }

  updateWorkloadChart(period) {
    console.log(`Updating workload chart for period: ${period}`);
    // Here you would typically fetch new data based on the selected period
    // For now, just refresh the current data
    this.updateWorkloadBars();
  }

  animateCharts() {
    // Animate donut chart on load
    const chartSegments = document.querySelectorAll('.chart-segment');
    chartSegments.forEach((segment, index) => {
      segment.style.strokeDashoffset = '251.32'; // Full circle
      
      setTimeout(() => {
        segment.style.transition = 'stroke-dashoffset 1s ease-in-out';
        const originalOffset = segment.getAttribute('stroke-dashoffset') || '0';
        segment.style.strokeDashoffset = originalOffset;
      }, index * 200);
    });

    // Animate workload bars
    const workloadBars = document.querySelectorAll('.bar-fill');
    workloadBars.forEach((bar, index) => {
      const originalWidth = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.width = originalWidth;
      }, 500 + (index * 100));
    });
  }

  updateLastUpdate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
      const now = new Date();
      lastUpdateElement.textContent = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    if (this.isMobile) {
      // Mobile: show/hide sidebar
      this.sidebarOpen = !this.sidebarOpen;
      if (this.sidebarOpen) {
        sidebar.classList.add('open');
      } else {
        sidebar.classList.remove('open');
      }
    } else {
      // Desktop: collapse/expand sidebar
      this.sidebarCollapsed = !this.sidebarCollapsed;
      if (this.sidebarCollapsed) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('open');
      this.sidebarOpen = false;
    }
  }

  handleResponsive() {
    const newIsMobile = window.innerWidth <= 1024;
    
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      const sidebar = document.getElementById('sidebar');
      
      if (this.isMobile) {
        // Switch to mobile mode
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('open');
        this.sidebarCollapsed = false;
        this.sidebarOpen = false;
      } else {
        // Switch to desktop mode
        sidebar.classList.remove('open');
        this.sidebarOpen = false;
      }
    }
  }

  showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
      
      // Update document title
      this.updateDocumentTitle(sectionId);
    }
  }

  setActiveNavItem(activeItem) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  updateDocumentTitle(sectionId) {
    const titles = {
      'dashboard': 'Dashboard Principal',
      'projects': 'Gestión de Proyectos',
      'engineering': 'Área de Ingeniería',
      'civil-works': 'Área de Obras Civiles',
      'naval': 'Área Naval',
      'electrical': 'Área Eléctrica',
      'documents': 'Repositorio de Documentos',
      'settings': 'Configuración'
    };
    
    const sectionTitle = titles[sectionId] || 'Dashboard';
    document.title = `${sectionTitle} - Centro de Control Aquamet`;
  }

  updateDateTime() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
      dateTimeElement.textContent = now.toLocaleDateString('es-ES', options);
    }
  }

  showNotificationsModal() {
    // Create and show notifications modal
    const modal = document.createElement('div');
    modal.className = 'notifications-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Notificaciones del Sistema</h3>
            <button class="close-modal" aria-label="Cerrar">&times;</button>
          </div>
          <div class="modal-body">
            <div class="notification-item warning">
              <div class="notification-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <div class="notification-content">
                <h4>Retraso en Obras Civiles</h4>
                <p>Las cimentaciones del Sector B presentan 2 días de retraso respecto al cronograma planificado.</p>
                <small>Hace 3 horas</small>
              </div>
            </div>
            
            <div class="notification-item maintenance">
              <div class="notification-icon">
                <i class="bi bi-tools"></i>
              </div>
              <div class="notification-content">
                <h4>Mantenimiento Programado</h4>
                <p>Se ha iniciado el mantenimiento preventivo de equipos eléctricos. Duración estimada: 4 horas.</p>
                <small>Hace 1 hora</small>
              </div>
            </div>
            
            <div class="notification-item info">
              <div class="notification-icon">
                <i class="bi bi-info-circle"></i>
              </div>
              <div class="notification-content">
                <h4>Revisión de Planos Completada</h4>
                <p>La revisión técnica de planos estructurales del Proyecto Naval-2024-03 ha sido completada satisfactoriamente.</p>
                <small>Hace 30 minutos</small>
              </div>
            </div>
            
            <div class="notification-item success">
              <div class="notification-icon">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="notification-content">
                <h4>Soldadura Estructural Finalizada</h4>
                <p>Se ha completado la soldadura estructural del casco principal. Pasando a fase de pruebas.</p>
                <small>Hace 2 horas</small>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary">Ver Todas las Notificaciones</button>
            <button class="btn-secondary">Marcar como Leídas</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // Button handlers
    const buttons = modal.querySelectorAll('.modal-footer button');
    buttons.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
  }

  startRealTimeUpdates() {
    // Update dashboard data every 30 seconds
    setInterval(() => {
      this.updateDateTime();
      this.updateLastUpdate();
      
      // Only update dashboard if it's currently visible
      const dashboardSection = document.getElementById('dashboard');
      if (dashboardSection && !dashboardSection.classList.contains('d-none')) {
        // Randomly update some dashboard elements
        if (Math.random() > 0.7) {
          this.updateMetrics();
        }
        if (Math.random() > 0.8) {
          this.updateAlertCount();
        }
      }
    }, 30000);

    // Update date/time every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Periodic dashboard refresh (every 5 minutes)
    setInterval(() => {
      const dashboardSection = document.getElementById('dashboard');
      if (dashboardSection && !dashboardSection.classList.contains('d-none')) {
        this.updateDashboardData();
      }
    }, 300000);

    // Simulate notification updates every 2 minutes
    setInterval(() => {
      this.updateNotificationCount();
    }, 120000);
  }

  updateNotificationCount() {
    const countElement = document.querySelector('.notification-count');
    if (countElement) {
      const currentCount = parseInt(countElement.textContent) || 0;
      const newCount = Math.max(0, currentCount + (Math.random() > 0.7 ? 1 : -1));
      countElement.textContent = newCount;
      
      // Hide badge if no notifications
      if (newCount === 0) {
        countElement.style.display = 'none';
      } else {
        countElement.style.display = 'flex';
      }
    }
  }

  // Public API methods for future expansion
  navigateTo(sectionId) {
    this.showSection(sectionId);
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
      this.setActiveNavItem(navItem);
    }
  }

  addNotification(type, title, message) {
    // Future implementation for adding real-time notifications
    console.log('New notification:', { type, title, message });
  }
}

// Additional CSS for modals and responsive behavior
const additionalStyles = `
  .notifications-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
  }

  .modal-overlay {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
  }

  .modal-content {
    background: var(--white);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: modalSlideIn 0.3s ease-out;
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-light);
    background: var(--technical-light);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .modal-header h3 {
    color: var(--primary-navy);
    margin: 0;
    font-size: 1.3rem;
  }

  .close-modal {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: var(--transition-fast);
  }

  .close-modal:hover {
    color: var(--status-critical);
    background: rgba(231, 76, 60, 0.1);
  }

  .modal-body {
    padding: var(--spacing-lg);
    max-height: 400px;
    overflow-y: auto;
  }

  .notification-item {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    border-left: 4px solid;
    transition: var(--transition-fast);
  }

  .notification-item:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-sm);
  }

  .notification-item:last-child {
    margin-bottom: 0;
  }

  .notification-item.warning {
    background: rgba(243, 156, 18, 0.1);
    border-left-color: var(--status-warning);
  }

  .notification-item.maintenance {
    background: rgba(155, 89, 182, 0.1);
    border-left-color: var(--status-maintenance);
  }

  .notification-item.info {
    background: rgba(52, 152, 219, 0.1);
    border-left-color: var(--status-info);
  }

  .notification-item.success {
    background: rgba(39, 174, 96, 0.1);
    border-left-color: var(--status-operational);
  }

  .notification-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .notification-item.warning .notification-icon {
    background: var(--status-warning);
    color: var(--white);
  }

  .notification-item.maintenance .notification-icon {
    background: var(--status-maintenance);
    color: var(--white);
  }

  .notification-item.info .notification-icon {
    background: var(--status-info);
    color: var(--white);
  }

  .notification-item.success .notification-icon {
    background: var(--status-operational);
    color: var(--white);
  }

  .notification-content {
    flex: 1;
  }

  .notification-content h4 {
    margin: 0 0 var(--spacing-xs) 0;
    color: var(--primary-navy);
    font-size: 1rem;
  }

  .notification-content p {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--text-primary);
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .notification-content small {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: var(--font-weight-medium);
  }

  .modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-light);
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    background: var(--technical-light);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }

  .btn-primary,
  .btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: var(--transition-fast);
    font-size: 0.9rem;
  }

  .btn-primary {
    background: var(--accent-blue);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-blue);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-medium);
  }

  .btn-secondary:hover {
    background: var(--white);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .modal-overlay {
      padding: var(--spacing-md);
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-md);
    }
    
    .notification-item {
      padding: var(--spacing-md);
    }
    
    .modal-footer {
      flex-direction: column;
    }
    
    .btn-primary,
    .btn-secondary {
      width: 100%;
      justify-content: center;
    }
  }

  /* Sidebar mobile behavior */
  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-100%);
    }
    
    .sidebar.open {
      transform: translateX(0);
      box-shadow: var(--shadow-lg);
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.aquametDashboard = new AquametDashboard();
  // Make dashboard available globally for modal callbacks
  window.dashboard = window.aquametDashboard;
});

// Export for potential module usage
export default AquametDashboard;
