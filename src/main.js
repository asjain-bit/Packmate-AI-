// PackMate main dashboard application logic

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. DASHBOARD OVERVIEW WIDGETS INTERACTIONS
  // ==========================================

  // Interactive Task List Row checklist for "Today's Checklist" widget
  const todayTasks = document.querySelectorAll('.today-task-row');
  const todayPendingCount = document.getElementById('todayPendingCount');

  function updateTodayPendingCount() {
    if (!todayPendingCount) return;
    const uncheckedCount = Array.from(todayTasks).filter(row => !row.classList.contains('checked')).length;
    todayPendingCount.innerText = `${uncheckedCount} task${uncheckedCount !== 1 ? 's' : ''} pending`;

    // Update linear progress bar indicator
    const totalCount = todayTasks.length;
    const checkedCount = totalCount - uncheckedCount;
    const percentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
    const progressFill = document.getElementById('todayProgressFill');
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  }

  todayTasks.forEach(row => {
    const toggleTask = () => {
      row.classList.toggle('checked');
      const isChecked = row.classList.contains('checked');
      row.setAttribute('aria-checked', isChecked);
      
      const checkbox = row.querySelector('.custom-checkbox');
      if (checkbox) {
        checkbox.innerHTML = isChecked ? '✓' : '';
      }
      
      updateTodayPendingCount();
    };

    row.addEventListener('click', toggleTask);
    
    row.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleTask();
      }
    });
  });

  // Upgrade & Tips mock alerts
  const btnUpgrade = document.getElementById('btnUpgrade');
  if (btnUpgrade) {
    btnUpgrade.addEventListener('click', () => {
      alert('🌟 PackMate Premium will unlock unlimited trips, collaborative checklist sharing, and real-time weather alerts! (Feature coming soon)');
    });
  }

  const btnTipSuggestions = document.getElementById('btnTipSuggestions');
  if (btnTipSuggestions) {
    btnTipSuggestions.addEventListener('click', () => {
      openOnboarding();
      runAISimulator({
        destination: 'Manali, India',
        weather: 'Cold',
        type: 'Adventure',
        companions: 'Solo',
        activities: ['Hiking']
      });
    });
  }

  // ==========================================
  // 2. ONBOARDING MODAL & PLANNING EVENTS
  // ==========================================

  const onboardingModal = document.getElementById('onboardingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBarFill = document.getElementById('progressBarFill');

  // Trigger modal from various buttons
  const startNewTripHeroBtn = document.getElementById('cardStartNewTripHero');
  const mobileFloatingCta = document.getElementById('mobileFloatingCta');

  // Open modal functions
  function openOnboarding() {
    onboardingModal.classList.add('active');
    progressBarContainer.style.display = 'block';
    
    // Reset form fields
    document.getElementById('travelerName').value = 'Ashika'; // Default user
    document.getElementById('travelerAge').value = '24';      // Default user
    document.getElementById('tripDestination').value = '';
    document.getElementById('describeTripText').value = '';
  }

  function closeOnboarding() {
    onboardingModal.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeOnboarding);

  // Keyboard navigation escape close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && onboardingModal.classList.contains('active')) {
      closeOnboarding();
    }
  });

  // Flow cards selection
  const cards = {
    welcome: document.getElementById('cardWelcome'),
    methods: document.getElementById('cardMethods'),
    questionnaire: document.getElementById('cardQuestionnaire'),
    describe: document.getElementById('cardDescribe'),
    loader: document.getElementById('cardLoader'),
    checklist: document.getElementById('cardChecklist')
  };

  function showCard(cardId, progressPercent) {
    if (cardId === 'checklist') {
      // Close onboarding modal
      closeOnboarding();
      
      // Hide home dashboard + toolbar + prompt bar, show checklist page
      const homeContent = document.getElementById('dashboardHomeContent');
      const checklistPage = document.getElementById('checklistPageContent');
      const promptBar = document.getElementById('promptBarContainer');
      const toolbar = document.querySelector('.dashboard-toolbar');
      if (homeContent) homeContent.classList.add('hidden');
      if (promptBar) promptBar.classList.add('hidden');
      if (toolbar) toolbar.classList.add('hidden');

      // Deactivate all cards, but activate checklist
      Object.values(cards).forEach(card => {
        if (card) card.classList.remove('active');
      });
      if (cards.checklist) cards.checklist.classList.add('active');

      if (checklistPage) {
        checklistPage.classList.remove('hidden');
        // Smooth scroll to top of main dashboard container
        const mainDash = document.querySelector('.main-dashboard');
        if (mainDash) mainDash.scrollTop = 0;
      }
    } else {
      // Hide checklist page, show home dashboard + toolbar + prompt bar
      const homeContent = document.getElementById('dashboardHomeContent');
      const checklistPage = document.getElementById('checklistPageContent');
      const promptBar = document.getElementById('promptBarContainer');
      const toolbar = document.querySelector('.dashboard-toolbar');
      if (homeContent) homeContent.classList.remove('hidden');
      if (promptBar) promptBar.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      if (checklistPage) checklistPage.classList.add('hidden');

      Object.values(cards).forEach(card => {
        if (card) card.classList.remove('active');
      });
      if (cards[cardId]) cards[cardId].classList.add('active');
      if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;

      // Accessibility focus
      const heading = cards[cardId] ? cards[cardId].querySelector('h2') : null;
      if (heading) heading.focus();
    }
  }

  // Wire Back to Dashboard button
  const btnChecklistBackToDashboard = document.getElementById('btnChecklistBackToDashboard');
  if (btnChecklistBackToDashboard) {
    btnChecklistBackToDashboard.addEventListener('click', () => {
      const homeContent = document.getElementById('dashboardHomeContent');
      const checklistPage = document.getElementById('checklistPageContent');
      const promptBar = document.getElementById('promptBarContainer');
      const toolbar = document.querySelector('.dashboard-toolbar');
      if (homeContent) homeContent.classList.remove('hidden');
      if (promptBar) promptBar.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      if (checklistPage) checklistPage.classList.add('hidden');
    });
  }

  // Wire Start New Trip Hero Card
  if (startNewTripHeroBtn) {
    startNewTripHeroBtn.addEventListener('click', () => {
      openOnboarding();
      showCard('methods', 40);
    });
  }

  // Wire Mobile Floating Circular "+" button
  if (mobileFloatingCta) {
    mobileFloatingCta.addEventListener('click', () => {
      openOnboarding();
      showCard('welcome', 20); // Go through the name entry flow for mobile users
    });
  }

  // Welcome page continue button
  const btnWelcomeContinue = document.getElementById('btnWelcomeContinue');
  if (btnWelcomeContinue) {
    btnWelcomeContinue.addEventListener('click', () => {
      const name = document.getElementById('travelerName').value.trim();
      const age = document.getElementById('travelerAge').value.trim();
      if (!name || !age) {
        alert('Please enter your name and age to continue.');
        return;
      }
      showCard('methods', 40);
    });
  }

  // Back actions
  document.getElementById('btnBackToWelcome').addEventListener('click', () => {
    showCard('welcome', 20);
  });
  document.getElementById('btnBackToMethods').addEventListener('click', () => {
    showCard('methods', 40);
  });

  // Modal selector inside choose method card
  let selectedMethod = '';
  document.getElementById('methodQuestionnaire').addEventListener('click', () => {
    selectedMethod = 'questionnaire';
    setupQuestionnaireWizard();
    showCard('questionnaire', 60);
  });

  document.getElementById('methodDescribe').addEventListener('click', () => {
    selectedMethod = 'describe';
    showCard('describe', 60);
  });

  document.getElementById('methodAIDecide').addEventListener('click', () => {
    selectedMethod = 'aidecide';
    // Close modal
    document.getElementById('onboardingModal').classList.remove('active');
    
    // Start AI Chat flow asking for destination
    startChatConversation("I want to plan a new trip, please help me.");
  });

  // ==========================================
  // 3. WIZARD QUESTIONNAIRE NAVIGATION & ACTIONS
  // ==========================================

  let currentWizardStep = 1;
  const qSteps = [
    document.getElementById('qStep1'),
    document.getElementById('qStep2'),
    document.getElementById('qStep3')
  ];
  const qStepTitle = document.getElementById('questionnaireStepTitle');
  const currentStepNum = document.getElementById('currentStepNum');
  const btnQuestionnaireBack = document.getElementById('btnQuestionnaireBack');
  const btnQuestionnaireNext = document.getElementById('btnQuestionnaireNext');

  function setupQuestionnaireWizard() {
    currentWizardStep = 1;
    updateWizardUI();
  }

  function updateWizardUI() {
    qSteps.forEach((step, idx) => {
      if (step) {
        if (idx + 1 === currentWizardStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      }
    });

    if (currentStepNum) currentStepNum.innerText = currentWizardStep;

    if (currentWizardStep === 1) {
      if (qStepTitle) qStepTitle.innerText = "Where & When is your trip?";
      btnQuestionnaireNext.innerText = "Continue";
    } else if (currentWizardStep === 2) {
      if (qStepTitle) qStepTitle.innerText = "Tell us about the vibes";
      btnQuestionnaireNext.innerText = "Continue";
    } else {
      if (qStepTitle) qStepTitle.innerText = "What are you doing?";
      btnQuestionnaireNext.innerText = "Generate Packing List ✨";
    }
  }

  btnQuestionnaireBack.addEventListener('click', () => {
    if (currentWizardStep > 1) {
      currentWizardStep--;
      updateWizardUI();
    } else {
      showCard('methods', 40);
    }
  });

  btnQuestionnaireNext.addEventListener('click', () => {
    if (currentWizardStep === 1) {
      const dest = document.getElementById('tripDestination').value.trim();
      if (!dest) {
        alert('Please enter a destination.');
        return;
      }
      currentWizardStep++;
      updateWizardUI();
    } else if (currentWizardStep === 2) {
      currentWizardStep++;
      updateWizardUI();
    } else {
      // Collect values
      const activeType = document.querySelector('#tripTypeGrid .pill-option.active').dataset.value;
      const activeWeather = document.querySelector('#weatherTypeGrid .pill-option.active').dataset.value;
      const activeCompanions = document.querySelector('#companionsGrid .pill-option.active').dataset.value;
      
      const activeActivities = [];
      document.querySelectorAll('#activitiesGrid .pill-option.active').forEach(p => {
        activeActivities.push(p.dataset.value);
      });

      const tripData = {
        destination: document.getElementById('tripDestination').value.trim(),
        dates: formatTripDates(document.getElementById('tripStart').value, document.getElementById('tripEnd').value),
        weather: activeWeather,
        type: activeType,
        companions: activeCompanions,
        activities: activeActivities
      };
      runAISimulator(tripData);
    }
  });

  // Wizard pills toggles setup
  setupPillToggles('#tripTypeGrid .pill-option', false);
  setupPillToggles('#weatherTypeGrid .pill-option', false);
  setupPillToggles('#companionsGrid .pill-option', false);
  setupPillToggles('#activitiesGrid .pill-option', true);

  function setupPillToggles(selector, multiSelect) {
    const options = document.querySelectorAll(selector);
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (!multiSelect) {
          options.forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
        } else {
          opt.classList.toggle('active');
        }
      });
    });
  }

  // Describe natural text parsing
  const btnDescribeGenerate = document.getElementById('btnDescribeGenerate');
  if (btnDescribeGenerate) {
    btnDescribeGenerate.addEventListener('click', () => {
      const text = document.getElementById('describeTripText').value.trim();
      if (!text) {
        alert('Please describe your trip briefly.');
        return;
      }
      
      const parsedData = {
        destination: text.match(/(to|in|at)\s+([A-Z][a-zA-Z\s]+)/)?.[2]?.trim() || 'Custom Destination',
        dates: 'Flexible dates',
        weather: text.toLowerCase().includes('cold') || text.toLowerCase().includes('snow') ? 'Cold' : text.toLowerCase().includes('rain') ? 'Rainy' : 'Sunny',
        type: text.toLowerCase().includes('hiking') || text.toLowerCase().includes('camp') ? 'Adventure' : 'City Break',
        companions: text.toLowerCase().includes('family') ? 'Family' : 'Solo',
        activities: []
      };
      if (text.toLowerCase().includes('hik')) parsedData.activities.push('Hiking');
      if (text.toLowerCase().includes('photograph')) parsedData.activities.push('Photography');
      if (text.toLowerCase().includes('swim')) parsedData.activities.push('Swimming');

      runAISimulator(parsedData);
    });
  }

  function formatTripDates(startStr, endStr) {
    if (!startStr || !endStr) return 'Flexible dates';
    const opt = { month: 'short', day: 'numeric' };
    const start = new Date(startStr);
    const end = new Date(endStr);
    return `${start.toLocaleDateString('en-US', opt)} – ${end.toLocaleDateString('en-US', opt)}`;
  }

  // AI Packing Generator loader sequence
  function runAISimulator(tripData) {
    showCard('loader', 80);
    const loaderText = document.getElementById('loaderText');
    const phases = [
      { text: "Scanning destination weather...", delay: 800 },
      { text: "Analyzing packing recommendations...", delay: 1800 },
      { text: "Organizing your smart list...", delay: 2800 },
      { text: "Tailoring packing essentials...", delay: 3600 }
    ];

    phases.forEach(phase => {
      setTimeout(() => {
        if (loaderText) loaderText.innerText = phase.text;
      }, phase.delay);
    });

    setTimeout(() => {
      generatePackingList(tripData);
    }, 4000);
  }

  // ==========================================
  // 4. INTERACTIVE CHECKLIST VIEW RENDERING
  // ==========================================

  function generatePackingList(tripData) {
    if (progressBarContainer) progressBarContainer.style.display = 'none';

    document.getElementById('sidebarTripTitle').innerText = `Trip to ${tripData.destination}`;
    document.getElementById('sidebarDest').innerText = tripData.destination;
    document.getElementById('sidebarDates').innerText = tripData.dates || 'Flexible dates';
    document.getElementById('sidebarWeather').innerText = `${tripData.weather} Weather`;
    document.getElementById('sidebarStyle').innerText = `${tripData.type} • ${tripData.companions}`;

    const checklistData = {
      Essentials: [
        { id: 'ess-1', name: 'Wallet (Cash/Cards)', checked: false },
        { id: 'ess-2', name: 'Passport & Boarding Pass', checked: false },
        { id: 'ess-3', name: 'House Keys', checked: false }
      ],
      Clothing: [
        { id: 'clo-1', name: 'Underwear & Socks (x5)', checked: false },
        { id: 'clo-2', name: 'Sleepwear', checked: false },
        { id: 'clo-3', name: 'Comfortable Shoes', checked: false }
      ],
      Toiletries: [
        { id: 'toi-1', name: 'Toothbrush & Toothpaste', checked: false },
        { id: 'toi-2', name: 'Deodorant', checked: false },
        { id: 'toi-3', name: 'Travel Shampoo & Bodywash', checked: false }
      ],
      Electronics: [
        { id: 'ele-1', name: 'Phone & Charger', checked: false },
        { id: 'ele-2', name: 'Power Bank', checked: false }
      ],
      Documents: [
        { id: 'doc-1', name: 'Hotel Booking confirmation', checked: false },
        { id: 'doc-2', name: 'Travel Insurance PDF', checked: false }
      ]
    };

    // Add elements based on weather
    if (tripData.weather === 'Sunny') {
      checklistData.Clothing.push({ id: 'wea-1', name: 'Sunglasses', checked: false });
      checklistData.Toiletries.push({ id: 'wea-2', name: 'Sunscreen (SPF 50)', checked: false });
      checklistData.Clothing.push({ id: 'wea-3', name: 'Shorts & T-shirts', checked: false });
    } else if (tripData.weather === 'Cold') {
      checklistData.Clothing.push({ id: 'wea-1', name: 'Heavy Insulated Jacket', checked: false });
      checklistData.Clothing.push({ id: 'wea-2', name: 'Beanie & Gloves', checked: false });
      checklistData.Clothing.push({ id: 'wea-3', name: 'Thermal Underlayers', checked: false });
    } else if (tripData.weather === 'Rainy') {
      checklistData.Clothing.push({ id: 'wea-1', name: 'Compact Umbrella', checked: false });
      checklistData.Clothing.push({ id: 'wea-2', name: 'Waterproof Rain Coat', checked: false });
      checklistData.Clothing.push({ id: 'wea-3', name: 'Waterproof Boots', checked: false });
    }

    // Add elements based on activities
    if (tripData.activities && tripData.activities.includes('Hiking')) {
      checklistData.Essentials.push({ id: 'act-1', name: 'Water Bottle (1L)', checked: false });
      checklistData.Clothing.push({ id: 'act-2', name: 'Hiking Shoes', checked: false });
      checklistData.Essentials.push({ id: 'act-3', name: 'Mini First-Aid Kit', checked: false });
    }
    if (tripData.activities && tripData.activities.includes('Swimming')) {
      checklistData.Clothing.push({ id: 'act-4', name: 'Swimsuit & Trunks', checked: false });
      checklistData.Essentials.push({ id: 'act-5', name: 'Quick-dry Towel', checked: false });
      checklistData.Essentials.push({ id: 'act-6', name: 'Goggles', checked: false });
    }
    if (tripData.activities && tripData.activities.includes('Dining Out')) {
      checklistData.Clothing.push({ id: 'act-7', name: 'Formal Dinner Wear', checked: false });
      checklistData.Clothing.push({ id: 'act-8', name: 'Elegant Dress Shoes', checked: false });
    }
    if (tripData.activities && tripData.activities.includes('Working')) {
      checklistData.Electronics.push({ id: 'act-9', name: 'Laptop & Charger', checked: false });
      checklistData.Essentials.push({ id: 'act-10', name: 'Notebook & Pen', checked: false });
    }
    if (tripData.activities && tripData.activities.includes('Photography')) {
      checklistData.Electronics.push({ id: 'act-11', name: 'Camera & Lens', checked: false });
      checklistData.Electronics.push({ id: 'act-12', name: 'Extra SD Memory Card', checked: false });
    }

    window.currentChecklist = checklistData;
    renderChecklist();
    showCard('checklist', 100);
  }

  function renderChecklist() {
    const container = document.getElementById('checklistCategoryContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let totalItems = 0;
    let checkedItems = 0;

    Object.keys(window.currentChecklist).forEach(category => {
      const list = window.currentChecklist[category];
      if (list.length === 0) return;

      const catChecked = list.filter(i => i.checked).length;
      const catTotal = list.length;
      totalItems += catTotal;
      checkedItems += catChecked;

      const sec = document.createElement('section');
      sec.className = 'category-section';
      sec.id = `category-${category}`;

      let emoji = '📦';
      if (category === 'Essentials') emoji = '✨';
      else if (category === 'Clothing') emoji = '👕';
      else if (category === 'Toiletries') emoji = '🧴';
      else if (category === 'Electronics') emoji = '🔌';
      else if (category === 'Documents') emoji = '🪪';

      sec.innerHTML = `
        <div class="category-header">
          <div class="category-title">
            <span class="category-icon">${emoji}</span>
            <h4>${category}</h4>
          </div>
          <span class="category-progress-text">${catChecked} of ${catTotal}</span>
        </div>
        <ul class="items-list" id="itemsList-${category}"></ul>
        <div class="add-item-container">
          <input type="text" class="input-field" placeholder="Add custom item..." id="newItemInput-${category}" style="padding: 10px 16px; border-radius: 12px;" />
          <button class="btn btn-secondary" style="padding: 10px 20px; border-radius: 12px; font-size: 0.9rem;" id="addItemBtn-${category}">Add</button>
        </div>
      `;

      container.appendChild(sec);

      const itemsList = document.getElementById(`itemsList-${category}`);
      list.forEach(item => {
        const itemRow = document.createElement('li');
        itemRow.className = `item-row ${item.checked ? 'checked' : ''}`;
        itemRow.setAttribute('role', 'checkbox');
        itemRow.setAttribute('aria-checked', item.checked);
        itemRow.setAttribute('tabindex', '0');

        itemRow.innerHTML = `
          <div class="item-left">
            <div class="custom-checkbox">
              ${item.checked ? '✓' : ''}
            </div>
            <span>${item.name}</span>
          </div>
          <button class="btn-delete-item" aria-label="Delete ${item.name}" data-id="${item.id}" data-category="${category}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        `;

        const toggleItem = () => {
          item.checked = !item.checked;
          renderChecklist();
        };

        itemRow.addEventListener('click', (e) => {
          if (!e.target.closest('.btn-delete-item')) {
            toggleItem();
          }
        });

        itemRow.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleItem();
          }
        });

        itemRow.querySelector('.btn-delete-item').addEventListener('click', (e) => {
          e.stopPropagation();
          const id = e.currentTarget.dataset.id;
          const cat = e.currentTarget.dataset.category;
          window.currentChecklist[cat] = window.currentChecklist[cat].filter(i => i.id !== id);
          renderChecklist();
        });

        itemsList.appendChild(itemRow);
      });

      document.getElementById(`addItemBtn-${category}`).addEventListener('click', () => {
        const inp = document.getElementById(`newItemInput-${category}`);
        const text = inp.value.trim();
        if (!text) return;
        
        window.currentChecklist[category].push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: text,
          checked: false
        });
        
        renderChecklist();
      });

      document.getElementById(`newItemInput-${category}`).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          document.getElementById(`addItemBtn-${category}`).click();
        }
      });
    });

    const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    document.getElementById('sidebarProgressText').innerText = `${progressPercent}%`;
    document.getElementById('sidebarProgressFill').style.width = `${progressPercent}%`;
    document.getElementById('checklistCountText').innerText = `Packed ${checkedItems} of ${totalItems} items`;
  }

  // Reset packing list items (uncheck all)
  document.getElementById('btnResetChecklist').addEventListener('click', () => {
    Object.keys(window.currentChecklist).forEach(cat => {
      window.currentChecklist[cat].forEach(item => {
        item.checked = false;
      });
    });
    renderChecklist();
  });

  // Export / Share Modal events
  const shareModal = document.getElementById('shareModal');
  const btnShareList = document.getElementById('btnShareList');
  const shareCloseBtn = document.getElementById('shareCloseBtn');

  if (btnShareList) {
    btnShareList.addEventListener('click', () => {
      shareModal.classList.add('active');
    });
  }

  if (shareCloseBtn) {
    shareCloseBtn.addEventListener('click', () => {
      shareModal.classList.remove('active');
    });
  }

  document.getElementById('shareCopyLink').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable packing list link copied to clipboard!');
  });

  document.getElementById('sharePrint').addEventListener('click', () => {
    window.print();
  });

  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.classList.remove('active');
    }
  });

  // Initial tasks count load
  updateTodayPendingCount();

  // Wire Hero Start Planning Button
  const btnHeroStartPlanning = document.getElementById('btnHeroStartPlanning');
  if (btnHeroStartPlanning) {
    btnHeroStartPlanning.addEventListener('click', () => {
      openOnboarding();
      showCard('welcome', 20);
    });
  }

  // Wire Sidebar AI Insight Card Learn More
  const btnLearnMore = document.getElementById('btnLearnMore');
  if (btnLearnMore) {
    btnLearnMore.addEventListener('click', (e) => {
      e.preventDefault();
      alert('🤖 AI Pack Smarter insights:\nPackMate learns your preferences over time. As you check off items, our model refines its suggestions to pack smarter and lighter on future trips!');
    });
  }

  // ==========================================
  // 5. NOTIFICATION DROPDOWN
  // ==========================================

  const btnNotifications = document.getElementById('btnNotifications');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const notifBadge = document.getElementById('notifBadge');
  const btnMarkAllRead = document.getElementById('btnMarkAllRead');
  const notifList = document.getElementById('notifList');
  const notifEmpty = document.getElementById('notifEmpty');

  if (btnNotifications) {
    btnNotifications.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (notificationDropdown && !notificationDropdown.contains(e.target) && e.target !== btnNotifications) {
      notificationDropdown.classList.remove('active');
    }
  });

  // Dismiss individual notification
  if (notifList) {
    notifList.addEventListener('click', (e) => {
      const dismissBtn = e.target.closest('.notif-dismiss');
      if (dismissBtn) {
        const item = dismissBtn.closest('.notif-item');
        item.style.transition = 'all 0.3s';
        item.style.opacity = '0';
        item.style.maxHeight = '0';
        item.style.padding = '0 20px';
        item.style.overflow = 'hidden';
        setTimeout(() => {
          item.remove();
          updateNotifBadge();
        }, 300);
      }
    });
  }

  // Mark all as read
  if (btnMarkAllRead) {
    btnMarkAllRead.addEventListener('click', () => {
      const unreadItems = document.querySelectorAll('.notif-item.unread');
      unreadItems.forEach(item => item.classList.remove('unread'));
      updateNotifBadge();
    });
  }

  function updateNotifBadge() {
    const unreadCount = document.querySelectorAll('.notif-item.unread').length;
    const remainingCount = document.querySelectorAll('.notif-item').length;
    
    if (notifBadge) {
      if (unreadCount > 0) {
        notifBadge.textContent = unreadCount;
        notifBadge.style.display = 'flex';
      } else {
        notifBadge.style.display = 'none';
      }
    }

    if (remainingCount === 0 && notifEmpty) {
      notifEmpty.classList.remove('hidden');
      if (notifList) notifList.classList.add('hidden');
      if (btnMarkAllRead) btnMarkAllRead.style.display = 'none';
    }
  }

  // ==========================================
  // 6. MY TRIPS PAGE NAVIGATION
  // ==========================================

  const navHome = document.getElementById('navHome');
  const navTrips = document.getElementById('navTrips');
  const navPackmateAI = document.getElementById('navPackmateAI');
  const btnViewAllTrips = document.getElementById('btnViewAllTrips');
  const myTripsPage = document.getElementById('myTripsPageContent');
  const btnNewTripFromTripsPage = document.getElementById('btnNewTripFromTripsPage');
  const packmateAIPage = document.getElementById('packmateAIPageContent');

  function showPage(page) {
    const homeContent = document.getElementById('dashboardHomeContent');
    const checklistPage = document.getElementById('checklistPageContent');
    const promptBar = document.getElementById('promptBarContainer');
    const toolbar = document.querySelector('.dashboard-toolbar');

    // Hide all pages
    if (homeContent) homeContent.classList.add('hidden');
    if (promptBar) promptBar.classList.add('hidden');
    if (toolbar) toolbar.classList.add('hidden');
    if (myTripsPage) myTripsPage.classList.add('hidden');
    if (checklistPage) checklistPage.classList.add('hidden');
    if (packmateAIPage) packmateAIPage.classList.add('hidden');

    // Reset sidebar active states
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));

    if (page === 'home') {
      if (homeContent) homeContent.classList.remove('hidden');
      if (promptBar) promptBar.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      if (navHome) navHome.classList.add('active');
      const headerGreeting = document.getElementById('headerGreeting');
      if (headerGreeting) headerGreeting.innerHTML = 'Good Morning, Ashika 👋';
    } else if (page === 'trips') {
      if (myTripsPage) myTripsPage.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      if (navTrips) navTrips.classList.add('active');
      const headerGreeting = document.getElementById('headerGreeting');
      if (headerGreeting) headerGreeting.innerHTML = 'My Trips';
    } else if (page === 'ai') {
      if (packmateAIPage) packmateAIPage.classList.remove('hidden');
      if (promptBar) promptBar.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      if (navPackmateAI) navPackmateAI.classList.add('active');
      const headerGreeting = document.getElementById('headerGreeting');
      if (headerGreeting) headerGreeting.innerHTML = 'Packmate AI';
    } else if (page === 'checklist') {
      if (checklistPage) checklistPage.classList.remove('hidden');
      if (toolbar) toolbar.classList.remove('hidden');
      const headerGreeting = document.getElementById('headerGreeting');
      if (headerGreeting) headerGreeting.innerHTML = 'Checklist';
    }

    // Scroll main area to top
    const mainDash = document.querySelector('.main-dashboard');
    if (mainDash) mainDash.scrollTop = 0;
  }

  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('home');
    });
  }
  
  if (navPackmateAI) {
    navPackmateAI.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('ai');
    });
  }

  if (navTrips) {
    navTrips.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('trips');
    });
  }

  if (btnViewAllTrips) {
    btnViewAllTrips.addEventListener('click', () => {
      showPage('trips');
    });
  }

  if (btnNewTripFromTripsPage) {
    btnNewTripFromTripsPage.addEventListener('click', () => {
      openOnboarding();
      showCard('methods', 40);
    });
  }

  // Trip filter pills
  const tripsFilterPills = document.getElementById('tripsFilterPills');
  if (tripsFilterPills) {
    tripsFilterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      tripsFilterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      const tripCards = document.querySelectorAll('.trip-card-large');
      tripCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.status === filter ? '' : 'none';
        }
      });
    });
  }

  // Trip search
  const tripsSearchInput = document.getElementById('tripsSearchInput');
  if (tripsSearchInput) {
    tripsSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const tripCards = document.querySelectorAll('.trip-card-large');
      tripCards.forEach(card => {
        const name = card.dataset.tripName.toLowerCase();
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });
  }

  // ==========================================
  // 7. AI CONVERSATIONAL PROMPT
  // ==========================================

  const aiChatContainer = document.getElementById('aiChatContainer');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const aiPromptInput = document.getElementById('aiPromptInput');
  const btnPromptSubmit = document.getElementById('btnPromptSubmit');
  const promptChipsWrapper = document.querySelector('.prompt-chips-wrapper');

  // AI Conversation state machine
  let chatState = 'idle'; // idle, destination, weather, tripType, companions, activities, generating
  let chatTripData = {};

  const chatQuestions = {
    destination: "Great! 🌍 Where are you heading? Type a destination or city name.",
    weather: "Got it! What weather are you expecting? Pick one:",
    tripType: "Nice! What kind of trip is this?",
    companions: "Almost there! Who are you traveling with?",
    activities: "Last one! What activities do you have planned? (You can type multiple, separated by commas)",
  };

  const chatOptions = {
    weather: [
      { label: '☀️ Sunny', value: 'Sunny' },
      { label: '❄️ Cold', value: 'Cold' },
      { label: '🌧️ Rainy', value: 'Rainy' }
    ],
    tripType: [
      { label: '🌲 Adventure', value: 'Adventure' },
      { label: '🏖️ Beach', value: 'Beach' },
      { label: '🏙️ City Break', value: 'City Break' },
      { label: '💼 Business', value: 'Business' }
    ],
    companions: [
      { label: '🙋 Solo', value: 'Solo' },
      { label: '👩‍❤️‍👨 Partner', value: 'Partner' },
      { label: '👨‍👩‍👧‍👦 Family', value: 'Family' },
      { label: '👫 Friends', value: 'Friends' }
    ]
  };

  function addChatBubble(text, isUser, withOptions = null) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
    bubble.innerHTML = text;

    if (withOptions) {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-quick-options';
      withOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-quick-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          handleChatResponse(opt.value);
        });
        optionsDiv.appendChild(btn);
      });
      bubble.appendChild(optionsDiv);
    }

    aiChatMessages.appendChild(bubble);
    aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    aiChatMessages.appendChild(indicator);
    aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function startChatConversation(initialMessage) {
    // Switch to AI page
    showPage('ai');
    
    // Hide subtitle
    const aiSubtitle = document.getElementById('aiPageSubHeader');
    if (aiSubtitle) aiSubtitle.classList.add('hidden');

    // Reset state
    chatState = 'destination';
    chatTripData = {};
    if (aiChatMessages) aiChatMessages.innerHTML = '';

    // Add user's initial message
    addChatBubble(initialMessage, true);

    // Try to parse destination from initial message
    const textLower = initialMessage.toLowerCase();
    let parsedDestination = null;

    // Try to extract destination
    const destMatch = initialMessage.match(/(?:to|in|at|for)\s+([A-Z][a-zA-Z\s]+)/);
    if (destMatch && destMatch[1]) {
      parsedDestination = destMatch[1].trim();
    }

    // Try to pre-parse other fields from the initial message
    if (textLower.includes('cold') || textLower.includes('winter') || textLower.includes('snow') || textLower.includes('december')) {
      chatTripData.weather = 'Cold';
    } else if (textLower.includes('rain')) {
      chatTripData.weather = 'Rainy';
    }
    if (textLower.includes('business') || textLower.includes('work')) {
      chatTripData.type = 'Business';
    } else if (textLower.includes('adventure') || textLower.includes('hik')) {
      chatTripData.type = 'Adventure';
    }
    if (textLower.includes('friends')) chatTripData.companions = 'Friends';
    else if (textLower.includes('family')) chatTripData.companions = 'Family';
    else if (textLower.includes('partner')) chatTripData.companions = 'Partner';
    if (textLower.includes('camping') || textLower.includes('camp')) {
      parsedDestination = parsedDestination || 'Camping Site';
      chatTripData.type = chatTripData.type || 'Adventure';
      chatTripData.companions = chatTripData.companions || 'Friends';
    }

    // Try to extract days info
    const daysMatch = textLower.match(/(\d+)\s*days?/);
    if (daysMatch) {
      chatTripData.dates = `${daysMatch[1]}-day trip`;
    }

    setTimeout(() => {
      if (parsedDestination) {
        chatTripData.destination = parsedDestination;
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(`✨ I'll help you pack for <strong>${parsedDestination}</strong>!`, false);
          advanceChat();
        }, 800);
      } else {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(chatQuestions.destination, false);
        }, 600);
      }
    }, 300);
  }

  function advanceChat() {
    // Determine next missing field
    if (!chatTripData.weather) {
      chatState = 'weather';
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(chatQuestions.weather, false, chatOptions.weather);
        }, 600);
      }, 400);
    } else if (!chatTripData.type) {
      chatState = 'tripType';
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(chatQuestions.tripType, false, chatOptions.tripType);
        }, 600);
      }, 400);
    } else if (!chatTripData.companions) {
      chatState = 'companions';
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(chatQuestions.companions, false, chatOptions.companions);
        }, 600);
      }, 400);
    } else if (!chatTripData.activities) {
      chatState = 'activities';
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addChatBubble(chatQuestions.activities, false);
        }, 600);
      }, 400);
    } else {
      // All data collected — generate!
      chatState = 'generating';
      setTimeout(() => {
        // Show the Claude-style thinking block
        const thinkingBlock = document.createElement('div');
        thinkingBlock.className = 'thinking-block';
        thinkingBlock.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-anim"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          Thinking...
        `;
        aiChatMessages.appendChild(thinkingBlock);
        aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
        
        setTimeout(() => {
          thinkingBlock.remove();
          addChatBubble("🎒 Perfect! I have everything I need. Your personalized packing list is ready!", false);
          
          setTimeout(() => {
            // Reset chat state
            resetChat();
            
            // Generate checklist directly (skip the old loader UI)
            document.getElementById('tripOnboardingOverlay').classList.remove('active');
            generatePackingList({
              destination: chatTripData.destination,
              weather: chatTripData.weather,
              type: chatTripData.type,
              companions: chatTripData.companions,
              activities: chatTripData.activities || ['Sightseeing'],
              dates: chatTripData.dates || 'Flexible dates'
            });
            showPage('checklist');
          }, 1200);
        }, 2500);
      }, 400);
    }
  }

  function handleChatResponse(value) {
    addChatBubble(value, true);

    if (chatState === 'destination') {
      chatTripData.destination = value;
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addChatBubble(`✨ <strong>${value}</strong> — sounds amazing!`, false);
        advanceChat();
      }, 600);
    } else if (chatState === 'weather') {
      chatTripData.weather = value;
      advanceChat();
    } else if (chatState === 'tripType') {
      chatTripData.type = value;
      advanceChat();
    } else if (chatState === 'companions') {
      chatTripData.companions = value;
      advanceChat();
    } else if (chatState === 'activities') {
      // Parse comma-separated activities
      const activities = value.split(',').map(a => a.trim()).filter(a => a);
      chatTripData.activities = activities.length > 0 ? activities : ['Sightseeing'];
      advanceChat();
    }
  }

  function resetChat() {
    chatState = 'idle';
    chatTripData = {};
    if (aiChatMessages) aiChatMessages.innerHTML = '';
    const aiSubtitle = document.getElementById('aiPageSubHeader');
    if (aiSubtitle) aiSubtitle.classList.remove('hidden');
  }

  // Submit prompt
  function submitPrompt() {
    if (!aiPromptInput) return;
    const promptText = aiPromptInput.value.trim();
    if (!promptText) return;

    aiPromptInput.value = '';
    
    // Always switch to AI page when submitting a prompt
    showPage('ai');

    if (chatState === 'idle') {
      // Start new conversation
      startChatConversation(promptText);
    } else {
      // Continue existing conversation
      handleChatResponse(promptText);
    }
  }

  // Suggestion chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (aiPromptInput) aiPromptInput.value = '';
      startChatConversation(prompt);
    });
  });

  if (btnPromptSubmit) {
    btnPromptSubmit.addEventListener('click', submitPrompt);
  }

  if (aiPromptInput) {
    aiPromptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitPrompt();
      }
    });
  }

  // Smooth scroll handler for Your Trips slider
  const btnNextTripScroll = document.getElementById('btnNextTripScroll');
  const tripsSlider = document.querySelector('.trips-horizontal-slider');
  if (btnNextTripScroll && tripsSlider) {
    btnNextTripScroll.addEventListener('click', () => {
      tripsSlider.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }
});
