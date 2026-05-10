// Admin UI Helpers Module

window.tablePagination = {
    guests: { page: 1, limit: 10, search: '', sort: { key: 'name', dir: 'asc' } },
    rsvp: { page: 1, limit: 10, search: '' },
    wishes: { search: '' }
};

window.renderPaginationControls = function (type, total, limit, currentPage) {
    const container = document.getElementById(`${type}Pagination`);
    if (!container) return;

    const totalPages = Math.ceil(total / limit) || 1;

    let html = `
        <div class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
            Menampilkan ${total === 0 ? 0 : (currentPage - 1) * limit + 1} - ${Math.min(total, currentPage * limit)} dari ${total} data
        </div>
        <div class="flex items-center gap-1 mt-3 sm:mt-0">
            <button onclick="window.changePage('${type}', ${currentPage - 1})" class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors" ${currentPage <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left text-[9px] sm:text-[10px]"></i>
            </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 5) {
            if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 1) {
                if (i === 2 || i === totalPages - 1) {
                    html += `<span class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs">...</span>`;
                }
                continue;
            }
        }

        const activeClass = i === currentPage ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800';
        html += `
            <button onclick="window.changePage('${type}', ${i})" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs transition-colors ${activeClass}">
                ${i}
            </button>
        `;
    }

    html += `
            <button onclick="window.changePage('${type}', ${currentPage + 1})" class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors" ${currentPage >= totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right text-[9px] sm:text-[10px]"></i>
            </button>
        </div>
    `;
    container.innerHTML = html;
};

window.changePage = function (type, newPage) {
    if (newPage < 1) newPage = 1;
    window.tablePagination[type].page = newPage;
    if (type === 'guests' && window.renderGuests) window.renderGuests();
    if (type === 'rsvp' && window.renderRsvpData) window.renderRsvpData();
};

window.changePageLimit = function (type, element) {
    window.tablePagination[type].limit = parseInt(element.value);
    window.tablePagination[type].page = 1;
    if (type === 'guests' && window.renderGuests) window.renderGuests();
    if (type === 'rsvp' && window.renderRsvpData) window.renderRsvpData();
};

window.handleLiveSearch = function (type, element) {
    if (type === 'wishes' && window.renderWishesData) {
        window.tablePagination[type].search = element.value;
        window.renderWishesData();
        return;
    }
    window.tablePagination[type].search = element.value;
    window.tablePagination[type].page = 1;
    if (type === 'guests' && window.renderGuests) window.renderGuests();
    if (type === 'rsvp' && window.renderRsvpData) window.renderRsvpData();
};


window.showToast = function(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    
    let baseClass = "toast-premium relative flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border transition-all duration-500 translate-y-12 opacity-0 mb-4 overflow-hidden min-w-[320px] max-w-md backdrop-blur-xl z-[9999]";
    let typeClass = "";
    let icon = "";
    let accentColor = "";

    if (type === 'success') {
        typeClass = "bg-white/90 dark:bg-slate-900/90 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
        icon = "fa-check-circle";
        accentColor = "bg-emerald-500";
    } else if (type === 'error') {
        typeClass = "bg-white/90 dark:bg-slate-900/90 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400";
        icon = "fa-exclamation-circle";
        accentColor = "bg-rose-500";
    } else if (type === 'delete') {
        typeClass = "bg-white/90 dark:bg-slate-900/90 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400";
        icon = "fa-trash-alt";
        accentColor = "bg-rose-500";
    } else if (type === 'info') {
        typeClass = "bg-white/90 dark:bg-slate-900/90 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400";
        icon = "fa-info-circle";
        accentColor = "bg-blue-500";
    }

    toast.className = `${baseClass} ${typeClass}`;
    toast.innerHTML = `
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <i class="fas ${icon} text-lg"></i>
        </div>
        <div class="flex-1">
            <p class="text-[13px] font-bold tracking-tight leading-snug">${message}</p>
        </div>
        <div class="absolute bottom-0 left-0 h-[3px] ${accentColor} w-full transition-all duration-[4000ms] ease-linear" id="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);

    // Initial width full, then animate to 0
    const progress = toast.querySelector('#toast-progress');

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-12', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            if (progress) progress.style.width = '0%';
        }, 50);
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-20px]', 'scale-95');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

window.showModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const backdrop = modal.querySelector('.modal-premium-backdrop');
    const content = modal.querySelector('.modal-premium-content');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        if (backdrop) {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
        }
        if (content) {
            content.classList.remove('opacity-0', 'scale-90');
            content.classList.add('opacity-100', 'scale-100');
        }
    }, 10);
};

window.hideModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const backdrop = modal.querySelector('.modal-premium-backdrop');
    const content = modal.querySelector('.modal-premium-content');

    if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
    }
    if (content) {
        content.classList.remove('opacity-100', 'scale-100');
        content.classList.add('opacity-0', 'scale-90');
    }

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }, 300);
};

window.showActionModal = function(options) {
    const modal = document.getElementById('adminActionModal');
    const title = document.getElementById('actionModalTitle');
    const iconContainer = document.getElementById('actionModalIcon');
    const fieldsContainer = document.getElementById('actionModalFields');
    const submitBtn = document.getElementById('actionModalSubmit');

    title.innerText = options.title || 'Action';
    iconContainer.className = `accent-square ${options.color || 'bg-indigo-600'}`;
    iconContainer.innerHTML = `<i class="fas ${options.icon || 'fa-edit'}"></i>`;

    fieldsContainer.innerHTML = (options.fields || []).map(f => `
        <div class="space-y-2">
            <label class="text-[11px] sm:text-xs font-semibold text-slate-600 px-1">${f.label}</label>
            <div class="relative">
                <i class="fas ${f.icon || 'fa-tag'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input type="${f.type || 'text'}" id="${f.id}" value="${f.value || ''}" class="input-premium !pl-11" placeholder="${f.placeholder || ''}">
            </div>
        </div>
    `).join('');

    submitBtn.onclick = async () => {
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> LOADING...';
            await options.onSubmit();
            window.hideModal('adminActionModal');
        } catch (err) {
            window.showToast(err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> SELESAI';
        }
    };

    window.showModal('adminActionModal');
};

window.deleteWithConfirm = function(onConfirm, options = {}) {
    const modal = document.getElementById('adminConfirmModal');
    const message = document.getElementById('confirmModalMessage');
    const confirmBtn = document.getElementById('confirmModalSubmit');
    const iconEl = modal.querySelector('.fa-trash-alt') || modal.querySelector('.fas');

    message.innerText = options.message || 'Apakah Anda yakin ingin menghapus data ini?';
    confirmBtn.innerText = options.confirmText || 'Hapus Data';
    
    if (iconEl && options.icon) {
        iconEl.className = `fas ${options.icon}`;
    } else if (iconEl && !options.icon) {
        iconEl.className = `fas fa-trash-alt`;
    }
    
    // Reset and apply color
    confirmBtn.className = confirmBtn.className.replace(/btn-\w+/g, '');
    confirmBtn.classList.add('btn-premium');
    confirmBtn.classList.add(options.btnClass || 'btn-danger');
    
    confirmBtn.onclick = async () => {
        try {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> PROSES...';
            await onConfirm();
            window.hideModal('adminConfirmModal');
        } catch (err) {
            window.showToast(err.message, 'error');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerText = options.confirmText || 'Hapus Data';
        }
    };

    window.showModal('adminConfirmModal');
};

window.openImagePreview = function(src) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300';
    modal.onclick = (e) => {
        if (e.target === modal) window.closeImagePreview(modal);
    };

    modal.innerHTML = `
    <div class="relative max-w-5xl max-h-[90vh] p-2 scale-95 transition-transform duration-300" id="previewImageWrapper">
      <button onclick="window.closeImagePreview(this.closest('.fixed'))" class="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full text-slate-900 shadow-2xl hover:bg-slate-100 hover:scale-110 transition-all font-bold z-10 flex items-center justify-center">
        <i class="fas fa-times"></i>
      </button>
      <img src="${src}" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-slate-800">
    </div>
  `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        const wrapper = modal.querySelector('#previewImageWrapper');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    });
};

window.closeImagePreview = function(modal) {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    const wrapper = modal.querySelector('#previewImageWrapper');
    wrapper.classList.add('scale-95');
    setTimeout(() => modal.remove(), 300);
};

// Dark Mode Toggle
window.toggleDarkMode = function() {
    const html = document.documentElement;
    const icon = document.getElementById('darkModeIcon');
    const isDark = html.classList.toggle('dark');
    
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    const toggleIcon = document.querySelector('#desktopSidebarToggle i');
    
    if (!sidebar || !main) return;

    const isHidden = sidebar.classList.toggle('sidebar-hidden');
    main.classList.toggle('sidebar-hidden');
    
    // Update the icon based on state
    if (toggleIcon) {
        if (isHidden) {
            toggleIcon.className = 'fas fa-indent';
        } else {
            toggleIcon.className = 'fas fa-bars';
        }
    }
};

// Initialize Theme
(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        setTimeout(() => {
            const icon = document.getElementById('darkModeIcon');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }, 100);
    }
})();

// Notifications Toggle
window.toggleNotifications = function() {
    const menu = document.getElementById('notificationsMenu');
    if (!menu) return;
    
    const isHidden = menu.classList.contains('opacity-0');
    if (isHidden) {
        if (window.closeAllHeaderMenus) window.closeAllHeaderMenus();
        menu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', '-translate-y-4');
        menu.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    } else {
        menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none', '-translate-y-4');
        menu.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    }
};

// Notification Tabs
window.setNotificationTab = function(tab) {
    window.state.currentNotificationTab = tab;
    
    const tabs = ['all', 'today', 'week', 'earlier'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-notif-${t}`);
        if (btn) {
            if (t === tab) {
                btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-indigo-600', 'dark:text-indigo-400', 'border', 'border-slate-200', 'dark:border-slate-700');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-indigo-600', 'dark:text-indigo-400', 'border', 'border-slate-200', 'dark:border-slate-700');
                btn.classList.add('text-slate-400');
            }
        }
    });
    
    if (window.populateNotifications) window.populateNotifications();
};

// Global Search Toggle (Mobile)
window.toggleSearch = function() {
    const panel = document.getElementById('mobileSearchPanel');
    if (!panel) return;
    
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) {
        panel.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('opacity-0', '-translate-y-4');
            panel.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    } else {
        panel.classList.add('opacity-0', '-translate-y-4');
        panel.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => panel.classList.add('hidden'), 300);
    }
};

// Global Search Handler
window.handleGlobalSearch = function(query) {
    const resultsPanel = document.getElementById('globalSearchResults');
    const resultsList = document.getElementById('globalSearchList');
    if (!resultsPanel || !resultsList) return;

    if (!query || query.trim().length < 2) {
        resultsPanel.classList.add('hidden');
        return;
    }

    const q = query.toLowerCase().trim();
    if (window.closeAllHeaderMenus) window.closeAllHeaderMenus();
    resultsPanel.classList.remove('hidden');
    
    const dashboard = window.state.dashboard;
    if (!dashboard) {
        resultsList.innerHTML = '<div class="py-10 text-center text-slate-400">Menyiapkan data...</div>';
        return;
    }

    // Grouping by name
    const grouped = {};

    const addToGroup = (name, data, type) => {
        if (!name) return;
        const key = name.toLowerCase().trim();
        if (!grouped[key]) {
            grouped[key] = {
                display: name,
                guest: null,
                rsvp: null,
                wish: null,
                time: data.created_at,
                id: data.id
            };
        }
        const g = grouped[key];
        if (type === 'guest') g.guest = data;
        if (type === 'rsvp') g.rsvp = data;
        if (type === 'wish') g.wish = data;
        
        if (data.created_at && (!g.time || new Date(data.created_at) > new Date(g.time))) {
            g.time = data.created_at;
        }
    };

    // Search in Guests
    (dashboard.guests || []).filter(g => 
        (g.name && g.name.toLowerCase().includes(q)) || 
        (g.slug && g.slug.toLowerCase().includes(q))
    ).forEach(g => addToGroup(g.name, g, 'guest'));

    // Search in RSVP
    (dashboard.rsvps || []).filter(r => 
        (r.guest_name && r.guest_name.toLowerCase().includes(q))
    ).forEach(r => addToGroup(r.guest_name, r, 'rsvp'));

    // Search in Wishes
    (dashboard.wishes || []).filter(w => 
        (w.guest_name && w.guest_name.toLowerCase().includes(q)) || 
        (w.message && w.message.toLowerCase().includes(q))
    ).forEach(w => addToGroup(w.guest_name, w, 'wish'));

    const all = Object.values(grouped).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15);

    if (all.length === 0) {
        resultsList.innerHTML = `
            <div class="py-12 text-center">
                <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-search text-slate-300 dark:text-slate-600 text-2xl"></i>
                </div>
                <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Tidak ada hasil</p>
                <p class="text-xs text-slate-400 mt-1">Coba kata kunci lain</p>
            </div>
        `;
        return;
    }

    resultsList.innerHTML = all.map(item => {
        let statusBadge = '';
        let messageBox = '';
        
        if (item.rsvp) {
            const statusStr = (item.rsvp.status || '').toLowerCase();
            const isHadir = statusStr === 'hadir';
            statusBadge = `
                <div class="${isHadir ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} border px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0">
                    <i class="fas ${isHadir ? 'fa-check-circle' : 'fa-times-circle'} text-[10px]"></i>
                    <span class="text-[10px] font-bold uppercase tracking-tight">${isHadir ? 'HADIR' : 'TIDAK HADIR'} (${item.rsvp.guest_count} ORANG)</span>
                </div>
            `;
        }
        
        if (item.wish) {
            messageBox = `
                <div class="mt-3 bg-indigo-50/40 dark:bg-indigo-500/5 border border-indigo-100/30 dark:border-indigo-500/10 p-3 rounded-xl relative">
                    <i class="fas fa-quote-left text-indigo-200/50 dark:text-indigo-800/30 absolute left-2 top-2 text-[10px]"></i>
                    <p class="text-[12px] text-slate-500 dark:text-slate-400 pl-5 font-normal italic leading-relaxed tracking-tight">${item.wish.message}</p>
                </div>
            `;
        }

        const type = item.rsvp ? 'rsvp' : (item.wish ? 'wish' : 'guest');
        const dateObj = new Date(item.time);
        const fullDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const fullTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        return `
        <div onclick="window.goToSearchResult('${type}', '${item.id}')" class="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-2xl cursor-pointer transition-all border border-slate-100/80 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900 group mb-4 shadow-sm hover:shadow-md">
            <div class="flex items-center justify-between gap-4 mb-1">
                <div class="flex items-center gap-3.5">
                    <div class="w-9 h-9 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700">
                        <i class="fas fa-user text-[11px]"></i>
                    </div>
                    <div>
                        <h5 class="text-[14px] font-medium text-slate-900 dark:text-slate-100 truncate tracking-tight mb-0.5">${item.display}</h5>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${fullDate}, ${fullTime}</p>
                    </div>
                </div>
                ${statusBadge}
            </div>
            ${messageBox}
        </div>
        `;
    }).join('');
};

window.closeGlobalSearch = function() {
    const resultsPanel = document.getElementById('globalSearchResults');
    if (resultsPanel) resultsPanel.classList.add('hidden');
    const desktopInput = document.getElementById('desktopSearchInput');
    const mobileInput = document.getElementById('mobileSearchInput');
    if (desktopInput) desktopInput.value = '';
    if (mobileInput) mobileInput.value = '';
};

window.goToSearchResult = function(type, id) {
    window.closeGlobalSearch();
    let section = '';
    if (type === 'guest') section = 'guests';
    else if (type === 'rsvp') section = 'rsvp';
    else if (type === 'wish') section = 'wishes';
    
    if (section && window.showSection) {
        window.showSection(section);
    }
};

// Time format helper
window.formatTimeAgo = function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j yang lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}h yang lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};
