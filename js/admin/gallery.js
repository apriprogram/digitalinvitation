// Gallery Admin Module

window.renderGallery = function() {
    const body = document.getElementById('galleryTableBody');
    if (!body) return;
    if (!window.state.dashboard.gallery || window.state.dashboard.gallery.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400">Belum ada foto galeri</td></tr>';
        return;
    }
    body.innerHTML = '';

    window.state.dashboard.gallery.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.className = "group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0";

        tr.innerHTML = `
      <td class="text-center px-4 align-middle text-slate-300 dark:text-slate-600 drag-handle cursor-grab active:cursor-grabbing">
        <i class="fas fa-grip-vertical text-sm"></i>
      </td>
      <td class="font-black text-slate-300 dark:text-slate-600 text-[10px] px-6 align-middle">${index + 1}</td>
      <td class="px-6 py-3">
        <div class="flex items-center gap-4">
             <div class="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 overflow-hidden group cursor-pointer" onclick="window.openImagePreview('${item.src}')">
                <img src="${item.src}" alt="${item.alt}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://ui-avatars.com/api/?name=${index + 1}&background=f1f5f9&color=94a3b8'">
             </div>
             <div class="flex flex-col gap-1">
                <span class="text-[10px] font-mono text-slate-500 dark:text-indigo-300 bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-indigo-500/30 break-all lg:break-normal">${item.src}</span>
             </div>
        </div>
      </td>
      <td class="font-bold text-slate-700 dark:text-slate-200 text-xs tracking-tight px-6 align-middle">${item.alt}</td>

      <td class="text-right px-6 align-middle">
        <div class="flex items-center justify-end gap-2">
            <button class="btn-premium btn-secondary !p-0 w-9 h-9 shrink-0 text-slate-400 hover:!text-amber-500 hover:!border-amber-500" onclick="window.editGalleryImage('${item.id}', '${item.alt.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${item.src}')">
                <i class="fas fa-edit text-xs pointer-events-none"></i>
            </button>
            <button class="btn-premium btn-secondary !p-0 w-9 h-9 shrink-0 text-slate-400 hover:!text-red-500 hover:!border-red-500" onclick="window.deleteGalleryImage('${item.id}')">
                <i class="fas fa-trash-can text-xs pointer-events-none"></i>
            </button>
        </div>
      </td>
    `;
        body.appendChild(tr);
    });

    // Initialize SortableJS for Gallery
    if (window.Sortable && window.state.dashboard.gallery.length > 0) {
        new Sortable(body, {
            animation: 250,
            handle: '.drag-handle',
            ghostClass: 'bg-indigo-50/50',
            onEnd: async function () {
                const newSequence = Array.from(body.querySelectorAll('tr')).map(tr => tr.dataset.id);
                try {
                    await api('/api/admin/gallery/reorder', {
                        method: 'POST',
                        body: JSON.stringify({ sequence: newSequence })
                    });
                    showToast(currentLang === 'id' ? 'Urutan galeri berhasil disimpan!' : 'Gallery order saved!', 'success');
                    const rows = body.querySelectorAll('tr');
                    rows.forEach((row, idx) => {
                        row.querySelector('td:nth-child(2)').innerText = idx + 1;
                    });
                } catch (err) {
                    showToast(err.message, 'error');
                }
            }
        });
    }
};

window.editGalleryImage = function(id, alt, src) {
    window.showActionModal({
        title: 'Ubah Foto Galeri',
        icon: 'fa-image',
        color: 'bg-indigo-600',
        fields: [
            { label: 'Keterangan (Alt Text)', id: 'editGalleryAlt', type: 'text', value: alt, icon: 'fa-tag' }
        ],
        onSubmit: async () => {
            const newAlt = document.getElementById('editGalleryAlt').value.trim();
            await api(`/api/admin/gallery/${id}/meta`, {
                method: 'PUT',
                body: JSON.stringify({ alt: newAlt })
            });
            showToast('Data foto diperbarui!', 'success');
            await window.loadDashboard();
        }
    });
};

window.deleteGalleryImage = function(id) {
    window.deleteWithConfirm(async () => {
        await api(`/api/admin/gallery/${id}`, { method: 'DELETE' });
        await window.loadDashboard();
        showToast('Foto berhasil dihapus.', 'delete');
    });
};

// Gallery Upload Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openGalleryUpload');
    const closeBtn = document.getElementById('closeGalleryUpload');
    const modal = document.getElementById('galleryUploadModal');
    const form = document.getElementById('galleryUploadForm');
    const fileInput = document.getElementById('galleryFile');
    const preview = document.getElementById('galleryUploadPreview');
    const previewImg = document.getElementById('galleryPreviewImg');
    const placeholder = document.getElementById('galleryUploadPlaceholder');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (form) form.reset();
            if (preview) preview.classList.add('hidden');
            if (placeholder) placeholder.classList.remove('hidden');
            window.showModal('galleryUploadModal');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.hideModal('galleryUploadModal'));
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImg) previewImg.src = e.target.result;
                    if (preview) preview.classList.remove('hidden');
                    if (placeholder) placeholder.classList.add('hidden');
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = fileInput.files[0];
            const alt = document.getElementById('galleryFileAlt').value;

            if (!file) {
                showToast('Pilih file foto terlebih dahulu', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt', alt);

            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> MENGUNGGAH...';

            try {
                const res = await fetch('/api/admin/gallery', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah foto');
                    showToast('Foto berhasil ditambahkan ke galeri', 'success');
                    window.hideModal('galleryUploadModal');
                    await window.loadDashboard();
                } else {
                    const text = await res.text();
                    throw new Error(`Server error (${res.status}): ${text.substring(0, 50)}`);
                }
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        });
    }
});
