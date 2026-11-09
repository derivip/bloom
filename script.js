document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. DYNAMIC TIME & THEME SYNC
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    function applyTimeBasedTheme() {
        const currentHour = new Date().getHours();
        const isDaytime = currentHour >= 8 && currentHour < 18;
        
        if (isDaytime) {
            setTheme('day');
        } else {
            setTheme('night');
        }
    }

    function setTheme(theme) {
        if (theme === 'night') {
            document.documentElement.setAttribute('data-theme', 'night');
            themeIcon.textContent = '🌙';
            themeLabel.textContent = 'Night Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.textContent = '☀️';
            themeLabel.textContent = 'Day Mode';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'night' ? 'day' : 'night');
    });

    applyTimeBasedTheme();

    // -------------------------------------------------------------
    // 2. TAB NAVIGATION SYSTEM
    // -------------------------------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // -------------------------------------------------------------
    // 3. DASHBOARD TASK MANAGER (LOCALSTORAGE PERSISTENCE)
    // -------------------------------------------------------------
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');

    let tasks = JSON.parse(localStorage.getItem('bloom_tasks')) || [];

    function saveAndRenderTasks() {
        localStorage.setItem('bloom_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        document.getElementById('highTaskList').innerHTML = '';
        document.getElementById('mediumTaskList').innerHTML = '';
        document.getElementById('lowTaskList').innerHTML = '';

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${escapeHTML(task.title)}</span>
                <button onclick="removeTask(${index})">✕</button>
            `;

            if (task.priority === 'high') {
                document.getElementById('highTaskList').appendChild(li);
            } else if (task.priority === 'medium') {
                document.getElementById('mediumTaskList').appendChild(li);
            } else {
                document.getElementById('lowTaskList').appendChild(li);
            }
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            title: taskInput.value.trim(),
            priority: prioritySelect.value
        };
        if (newTask.title) {
            tasks.push(newTask);
            saveAndRenderTasks();
            taskInput.value = '';
        }
    });

    window.removeTask = function(index) {
        tasks.splice(index, 1);
        saveAndRenderTasks();
    };

    renderTasks();

    // -------------------------------------------------------------
    // 4. LEARN & GROWTH PLATFORM
    // -------------------------------------------------------------
    const learnData = [
        { category: 'career', title: 'CompTIA A+ & Entry Security Roadmap', desc: 'Step-by-step guidance on self-studying for entry certifications without overspending.', type: 'Article' },
        { category: 'career', title: 'Workplace Communication Tips', desc: 'How to write quick, professional emails to supervisors and team leads.', type: 'Article' },
        { category: 'emotional', title: '5-Minute Box Breathing Exercise', desc: 'Quick technique to lower immediate anxiety before a shift or test.', type: 'Activity' },
        { category: 'emotional', title: 'Dealing with Imposter Syndrome', desc: 'Understanding why high achievers often feel like they aren\'t doing enough.', type: 'Video Guide' },
        { category: 'personal', title: 'Time Block Management for Busy Schedules', desc: 'Balancing schoolwork, evening shifts, and personal rest without crashing.', type: 'Article' },
        { category: 'physical', title: 'Budget Workout Routines', desc: 'Efficient dumbbell and bodyweight routines to maintain energy.', type: 'Activity' }
    ];

    const learnGrid = document.getElementById('learnGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    function renderLearnCards(filter = 'all') {
        learnGrid.innerHTML = '';
        const filtered = filter === 'all' ? learnData : learnData.filter(item => item.category === filter);

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'learn-card';
            card.innerHTML = `
                <div>
                    <span class="tag">${item.category} • ${item.type}</span>
                    <h4>${escapeHTML(item.title)}</h4>
                    <p>${escapeHTML(item.desc)}</p>
                </div>
                <button class="btn-primary" style="width:100%; font-size:0.85rem;">Open Module</button>
            `;
            learnGrid.appendChild(card);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLearnCards(btn.getAttribute('data-category'));
        });
    });

    renderLearnCards();

    // -------------------------------------------------------------
    // 5. MICRO-ADVISOR AI CHATBOT ENGINE
    // -------------------------------------------------------------
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const botKnowledge = [
        { keywords: ['stress', 'overwhelmed', 'tired', 'burnout', 'hard'], response: "When you're juggling work and school, feeling overwhelmed is completely valid. Take a 5-minute break right now: step away from screens, drink water, and reset." },
        { keywords: ['career', 'cert', 'comptia', 'job', 'tech'], response: "For tech and cybersecurity career paths, focus on small daily wins—like doing 15 practice exam questions or building small projects. Consistency beats intensity every time." },
        { keywords: ['procrastinate', 'focus', 'start', 'lazy'], response: "Don't try to finish everything at once. Use the 2-Minute Rule: commit to working on your highest priority task for just 2 minutes. Usually, starting is the hardest part." }
    ];

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const reply = getBotReply(text.toLowerCase());
            appendMessage(reply, 'bot');
        }, 500);
    });

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `<div class="msg-bubble">${escapeHTML(text)}</div>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotReply(input) {
        for (let item of botKnowledge) {
            if (item.keywords.some(kw => input.includes(kw))) {
                return item.response;
            }
        }
        return "I hear you. Remember to protect your mental energy, take things one step at a time, and keep your daily routine tight. What's the main task in front of you right now?";
    }

    // -------------------------------------------------------------
    // 6. LIGHTWEIGHT WEB AUDIO SYNTHESIZER (LOFI AMBIENT)
    // -------------------------------------------------------------
    const lofiToggle = document.getElementById('lofiToggle');
    const audioIcon = document.getElementById('audioIcon');
    let audioCtx = null;
    let isPlaying = false;
    let oscillator = null;
    let gainNode = null;

    lofiToggle.addEventListener('click', () => {
        if (!isPlaying) {
            startLofiSynth();
            isPlaying = true;
            audioIcon.textContent = '⏸️';
            lofiToggle.style.borderColor = 'var(--accent)';
        } else {
            stopLofiSynth();
            isPlaying = false;
            audioIcon.textContent = '🎵';
            lofiToggle.style.borderColor = 'var(--border-color)';
        }
    });

    function startLofiSynth() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
    }

    function stopLofiSynth() {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
        }
        if (audioCtx) {
            audioCtx.close();
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});