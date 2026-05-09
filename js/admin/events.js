// Events Admin Module

window.renderEvents = function() {
    const section = document.getElementById('eventsContainer');
    if (!section || !window.state.dashboard?.events) return;
    const events = window.state.dashboard.events || [];

    section.innerHTML = `
        ${events.map((event, i) => `
            <article class="bg-white dark:bg-slate-800 card-premium px-6 py-5 sm:px-8 sm:py-6 group relative">
                <div class="flex items-center justify-between mb-4 sm:mb-5 border-b border-slate-50 dark:border-slate-700 pb-3 sm:pb-3.5">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${i % 2 === 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} border flex items-center justify-center text-lg sm:text-xl">
                            <i class="fas ${i === 0 ? 'fa-ring' : 'fa-utensils'}"></i>
                        </div>
                        <div>
                            <h3 class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">${event.name || `${t('event_prefix')}${i + 1}`}</h3>
                            <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">${t('event_op_details')}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.deleteEvent('${event.id}')" class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                            <i class="fas fa-trash-alt text-[10px]"></i>
                        </button>
                        <button data-event-id="${event.id}" class="btn-premium btn-primary !h-9 sm:!h-10 !px-4 sm:!px-5 !text-[9px] sm:!text-[10px] uppercase tracking-widest save-event">
                            ${t('event_btn_update')}
                        </button>
                    </div>
                </div>
                <div class="grid gap-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_display_name')}</label>
                            <input id="event${event.id}Name" type="text" value="${event.name || ''}" class="input-premium">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_header_heading')}</label>
                            <input id="event${event.id}Heading" type="text" value="${event.heading || ''}" class="input-premium">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_timeline')}</label>
                            <input id="event${event.id}Time" type="text" value="${event.time || ''}" class="input-premium">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_cal_date')}</label>
                            <input id="event${event.id}DatePicker" type="date" value="${event.date_iso || ''}" class="input-premium cursor-pointer" 
                                onchange="window.updateEventDateDisplay(${event.id}, this.value)">
                            <input id="event${event.id}Date" type="hidden" value="${event.date || ''}">
                            <input id="event${event.id}DateIso" type="hidden" value="${event.date_iso || ''}">
                            <p id="event${event.id}DateLabel" class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold px-1 mt-1">${event.date || '(Pilih tanggal di atas)'}</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_venue_id')}</label>
                        <input id="event${event.id}Location" type="text" value="${event.location_name || ''}" class="input-premium">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_phys_addr')}</label>
                        <textarea id="event${event.id}Address" class="input-premium min-h-[100px]">${event.address || ''}</textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_map_src')}</label>
                        <textarea id="event${event.id}MapSrc" class="input-premium min-h-[80px] break-all" oninput="window.updateMapPreview(${event.id}, this.value)" placeholder="Tempel URL atau tag <iframe> Google Maps di sini">${event.map_src || ''}</textarea>
                        <div id="event${event.id}MapContainer" class="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 transition-all ${event.map_src ? 'block' : 'hidden'}">
                            <iframe id="event${event.id}MapIframe" src="${event.map_src || ''}" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" class="w-full"></iframe>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_dir_link')}</label>
                        <textarea id="event${event.id}MapLink" class="input-premium min-h-[60px] break-all">${event.map_link || ''}</textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">${t('event_icon_key')}</label>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 relative">
                                <img id="event${event.id}IconPreview" src="${event.icon_src || ''}" class="absolute inset-0 w-full h-full p-2 object-contain z-10 transition-opacity duration-300" onerror="this.classList.add('opacity-0')">
                                <i class="fas fa-star text-slate-300 dark:text-slate-600 text-xl sm:text-2xl"></i>
                            </div>
                            <label class="flex-1 cursor-pointer px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-center group font-sans">
                                <i class="fas fa-upload mr-2 opacity-60 group-hover:scale-110 transition-transform"></i> UPLOAD ICON
                                <input type="file" accept="image/*" class="hidden" onchange="window.uploadEventIcon(this, ${event.id}, 'event${event.id}IconPreview')">
                            </label>
                        </div>
                        <input id="event${event.id}Icon" type="hidden" value="${event.icon_src || ''}">
                    </div>
                </div>
            </article>
        `).join('')}
    `;

    section.querySelectorAll('.save-event').forEach(btn => {
        btn.addEventListener('click', () => window.saveEvent(btn.dataset.eventId));
    });
};

window.updateEventDateDisplay = function(eventId, dateIsoString) {
    if (!dateIsoString) return;
    const dateObj = new Date(dateIsoString);
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const dateFormatted = dateObj.toLocaleDateString('id-ID', options);
    
    const label = document.getElementById(`event${eventId}DateLabel`);
    if (label) label.innerText = dateFormatted;
    
    const hiddenDate = document.getElementById(`event${eventId}Date`);
    if (hiddenDate) hiddenDate.value = dateFormatted;
    
    const hiddenDateIso = document.getElementById(`event${eventId}DateIso`);
    if (hiddenDateIso) hiddenDateIso.value = dateIsoString;
};

window.updateMapPreview = function(eventId, value) {
    const container = document.getElementById(`event${eventId}MapContainer`);
    const iframe = document.getElementById(`event${eventId}MapIframe`);
    
    if (!value) {
        if (container) container.classList.add('hidden');
        return;
    }

    let src = value;
    if (value.includes('<iframe')) {
        const match = value.match(/src="([^"]+)"/);
        if (match) src = match[1];
    }

    if (iframe) {
        iframe.src = src;
        if (container) container.classList.remove('hidden');
    }
    
    const input = document.getElementById(`event${eventId}MapSrc`);
    if (input) input.value = src;
};

window.setEventBgMode = function(mode, skipSave = false) {
    const slider = document.getElementById('eventBgModeSlider');
    const colorBtn = document.getElementById('eventModeColorBtn');
    const imageBtn = document.getElementById('eventModeImageBtn');
    const checkbox = document.getElementById('settingEventBgMode');
    if (!slider || !colorBtn || !imageBtn || !checkbox) return;

    const isImage = mode === 'image';
    checkbox.checked = isImage;
    if (isImage) {
        slider.style.left = 'calc(50% - 1px)';
        slider.style.width = 'calc(50% - 3px)';
        colorBtn.classList.remove('text-white');
        colorBtn.classList.add('text-slate-400');
        imageBtn.classList.remove('text-slate-400');
        imageBtn.classList.add('text-white');
    } else {
        slider.style.left = '4px';
        slider.style.width = 'calc(50% - 3px)';
        colorBtn.classList.remove('text-slate-400');
        colorBtn.classList.add('text-white');
        imageBtn.classList.remove('text-white');
        imageBtn.classList.add('text-slate-400');
    }
    if (!skipSave) saveSettings();
};

window.saveEvent = async function(id) {
    const payload = {
        name: document.getElementById(`event${id}Name`).value,
        heading: document.getElementById(`event${id}Heading`).value,
        time: document.getElementById(`event${id}Time`).value,
        date: document.getElementById(`event${id}Date`).value,
        date_iso: document.getElementById(`event${id}DateIso`).value,
        location_name: document.getElementById(`event${id}Location`).value,
        address: document.getElementById(`event${id}Address`).value,
        map_src: document.getElementById(`event${id}MapSrc`).value,
        map_link: document.getElementById(`event${id}MapLink`).value,
        icon_src: document.getElementById(`event${id}Icon`).value
    };

    try {
        await api(`/api/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Acara diperbarui!', 'success');
        await window.loadDashboard();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.deleteEvent = function(id) {
    window.deleteWithConfirm(async () => {
        await api(`/api/admin/events/${id}`, { method: 'DELETE' });
        await window.loadDashboard();
        showToast('Acara dihapus!', 'delete');
    }, {
        message: 'Apakah Anda yakin ingin menghapus acara ini?'
    });
};

window.addEvent = async function() {
    try {
        const payload = {
            name: 'Acara Baru',
            heading: 'Wedding Event',
            time: '08:00 - Selesai',
            date: 'Senin, 01 Januari 2025',
            date_iso: '2025-01-01',
            location_name: 'Nama Lokasi',
            address: 'Alamat lengkap lokasi acara',
            map_src: '',
            map_link: '',
            icon_src: 'img/icon/Ring.png'
        };
        await api('/api/admin/events', { method: 'POST', body: JSON.stringify(payload) });
        await window.loadDashboard();
        showToast('Acara baru ditambahkan!', 'success');
    } catch (err) {
        showToast('Gagal menambah acara', 'error');
    }
};

window.uploadEventIcon = async function(input, eventId, previewId) {
    if (!input.files || !input.files[0]) return;

    const formData = new FormData();
    formData.append('image', input.files[0]);

    try {
        const res = await fetch(`/api/admin/events/${eventId}/icon`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        const previewImg = document.getElementById(previewId);
        if (previewImg) {
            previewImg.src = data.src;
            previewImg.classList.remove('opacity-0');
        }

        const hiddenInput = document.getElementById(`event${eventId}Icon`);
        if (hiddenInput) hiddenInput.value = data.src;

        showToast(currentLang === 'id' ? 'Ikon acara berhasil diunggah!' : 'Event icon uploaded successfully!', 'success');
    } catch (e) {
        showToast(currentLang === 'id' ? 'Gagal mengupload ikon: ' + e.message : 'Upload failed: ' + e.message, 'error');
    }
};
