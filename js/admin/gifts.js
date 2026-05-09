// Gifts Admin Module

window.renderGifts = function() {
    const section = document.getElementById('giftsContainer');
    if (!section) return;

    const addrElem = document.getElementById('giftPhysicalAddress');
    if (addrElem && window.state.dashboard.settings) {
        addrElem.value = window.state.dashboard.settings.gift_physical_address || '';
    }

    const gifts = window.state.dashboard.gifts || [];

    section.innerHTML = `
        ${gifts.map((gift, i) => `
            <article data-id="${gift.id}" class="bg-white dark:bg-slate-800 card-premium border border-slate-100 dark:border-slate-700 p-6 shadow-none group relative cursor-move hover:border-indigo-200 dark:hover:border-indigo-500 transition-all duration-300">
                <div class="absolute top-4 left-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 drag-handle p-2 -m-2">
                    <i class="fas fa-grip-vertical text-lg"></i>
                </div>
                <button onclick="window.deleteGiftItem(${gift.id})" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10">
                    <i class="fas fa-trash-alt text-[10px]"></i>
                </button>
                <div class="flex items-center gap-4 mb-4 mt-6">
                    <div class="w-16 h-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center p-2 overflow-hidden relative">
                        <img id="gift${gift.id}Preview" src="${gift.logo_src || ''}" class="absolute inset-0 w-full h-full p-2 object-contain z-10 transition-opacity duration-300 ${!gift.logo_src ? 'opacity-0' : ''}" onerror="this.classList.add('opacity-0'); document.getElementById('gift${gift.id}Icon')?.classList.remove('hidden');">
                        <i id="gift${gift.id}Icon" class="fas fa-university text-slate-300 dark:text-slate-600 text-xl transition-opacity duration-300 ${gift.logo_src ? 'hidden' : ''}"></i>
                    </div>
                     <label class="cursor-pointer text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <i class="fas fa-upload mr-1"></i> UPLOAD LOGO
                        <input type="file" accept="image/*" class="hidden" onchange="window.uploadGiftIcon(this, ${gift.id}, 'gift${gift.id}Preview')">
                     </label>
                </div>
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">Nama Bank / E-Wallet</label>
                        <input type="text" id="gift${gift.id}Bank" value="${gift.bank_name || ''}" class="input-premium h-10 w-full" placeholder="Cth: BCA">
                    </div>
                    <div>
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">Nomor Rekening</label>
                        <input type="text" id="gift${gift.id}Number" value="${gift.account_number || ''}" class="input-premium h-10 w-full" placeholder="Cth: 1234567890">
                    </div>
                    <div>
                        <label class="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-1">Atas Nama (Pemilik)</label>
                        <input type="text" id="gift${gift.id}Name" value="${gift.account_name || ''}" class="input-premium h-10 w-full" placeholder="Cth: John Doe">
                    </div>
                    <button onclick="window.saveGiftItem(${gift.id})" class="btn-premium btn-primary w-full mt-2"><i class="fas fa-check mr-1"></i> SIMPAN</button>
                    <input type="hidden" id="gift${gift.id}Logo" value="${gift.logo_src || ''}">
                </div>
            </article>
        `).join('')}
    `;

    // Initialize SortableJS
    if (window.Sortable && gifts.length > 0) {
        new Sortable(section, {
            animation: 350,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            forceFallback: true,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onEnd: async function () {
                const ids = Array.from(section.querySelectorAll('article')).map(el => parseInt(el.dataset.id));
                const newGifts = ids.map(id => window.state.dashboard.gifts.find(g => g.id === id));
                window.state.dashboard.gifts = newGifts;

                try {
                    await api('/api/admin/gifts/reorder', { method: 'POST', body: JSON.stringify({ ids }) });
                } catch (err) {
                    window.showToast('Gagal menyimpan urutan', 'error');
                }
            }
        });
    }
};

window.saveGiftAddress = async function() {
    const address = document.getElementById('giftPhysicalAddress').value;
    try {
        await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ gift_physical_address: address }) });
        window.showToast('Alamat fisik berhasil disimpan', 'success');
        if (!window.state.dashboard.settings) window.state.dashboard.settings = {};
        window.state.dashboard.settings.gift_physical_address = address;
    } catch (err) {
        window.showToast('Gagal menyimpan alamat', 'error');
    }
};

window.addGiftItem = async function() {
    try {
        const response = await api('/api/admin/gifts', { method: 'POST', body: JSON.stringify({ bank_name: '', account_number: '', account_name: '', logo_src: '' }) });
        if (!window.state.dashboard.gifts) window.state.dashboard.gifts = [];
        window.state.dashboard.gifts.push(response.gift);
        window.renderGifts();
        window.showToast('Bank baru berhasil ditambahkan', 'success');
    } catch (err) {
        window.showToast('Gagal menambah bank', 'error');
    }
};

window.saveGiftItem = async function(id) {
    const payload = {
        bank_name: document.getElementById(`gift${id}Bank`).value,
        account_number: document.getElementById(`gift${id}Number`).value,
        account_name: document.getElementById(`gift${id}Name`).value,
        logo_src: document.getElementById(`gift${id}Logo`).value
    };

    try {
        await api(`/api/admin/gifts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        window.showToast('Data bank diperbarui!', 'success');
        await window.loadDashboard();
    } catch (err) {
        window.showToast(err.message, 'error');
    }
};

window.deleteGiftItem = async function(id) {
    window.deleteWithConfirm(async () => {
        await api(`/api/admin/gifts/${id}`, { method: 'DELETE' });
        await window.loadDashboard();
        window.showToast('Metode kado dihapus!', 'delete');
    });
};

window.uploadGiftIcon = async function(input, id, previewId) {
    if (!input.files || !input.files[0]) return;

    const formData = new FormData();
    formData.append('image', input.files[0]);

    try {
        const res = await fetch(`/api/admin/gifts/${id}/logo`, {
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
        const icon = document.getElementById(`gift${id}Icon`);
        if (icon) icon.classList.add('hidden');

        const hiddenInput = document.getElementById(`gift${id}Logo`);
        if (hiddenInput) hiddenInput.value = data.src;

        window.showToast('Logo bank berhasil diunggah!', 'success');
    } catch (e) {
        window.showToast('Gagal mengupload logo: ' + e.message, 'error');
    }
};

window.setGiftBgMode = function(mode, skipSave = false) {
    const checkbox = document.getElementById('settingGiftBgMode');
    const slider = document.getElementById('giftBgModeSlider');
    const colorBtn = document.getElementById('giftModeColorBtn');
    const imageBtn = document.getElementById('giftModeImageBtn');

    if (checkbox) checkbox.checked = (mode === 'image');

    if (mode === 'image') {
        if (slider) slider.style.left = 'calc(50% - 4px)';
        if (colorBtn) colorBtn.classList.replace('text-white', 'text-slate-400');
        if (imageBtn) imageBtn.classList.replace('text-slate-400', 'text-white');
    } else {
        if (slider) slider.style.left = '4px';
        if (colorBtn) colorBtn.classList.replace('text-slate-400', 'text-white');
        if (imageBtn) imageBtn.classList.replace('text-white', 'text-slate-400');
    }

    if (!skipSave) saveSettings();
};
