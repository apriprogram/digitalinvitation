// Wishes Admin Module

window.renderWishesData = function() {
    const wishContainer = document.getElementById('wishesCardContainer');
    if (!wishContainer) return;

    if (!window.state.dashboard) {
        wishContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-24 text-slate-400"><div class="text-4xl font-black opacity-10 mb-2">...</div><p class="text-[10px] font-bold uppercase tracking-widest opacity-30">Memuat data...</p></div>`;
        return;
    }

    const wishes = window.state.dashboard.wishes || [];
    let wishesList = [...wishes];
    const wishQuery = (window.tablePagination.wishes.search || '').toLowerCase();

    if (wishQuery) {
        wishesList = wishesList.filter(item => {
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
            return (item.guest_name && item.guest_name.toLowerCase().includes(wishQuery)) ||
                (item.message && item.message.toLowerCase().includes(wishQuery)) ||
                (dateStr.toLowerCase().includes(wishQuery));
        });
    }

    wishContainer.innerHTML = '';

    if (wishesList.length === 0) {
        if (wishes.length === 0) {
            wishContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-24 text-slate-400"><div class="text-6xl font-black opacity-10 mb-4">-</div><p class="text-sm font-bold uppercase tracking-widest opacity-30">Belum ada ucapan</p></div>`;
        } else {
            wishContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-10 text-slate-400 font-medium italic"><p>Pencarian tidak ditemukan</p></div>`;
        }
    } else {
        wishesList.forEach((item) => {
            const guestName = item.guest_name || '-';
            const message = item.message || '-';
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
            const initial = (guestName !== '-' ? guestName.charAt(0) : '?').toUpperCase();
            const card = document.createElement('div');
            card.className = 'px-4 py-2.5 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all rounded-xl mx-1 my-0.5 hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500 group';

            const adminAvatar = document.getElementById('headerUserAvatar') ? document.getElementById('headerUserAvatar').src : '';
            const adminName = (window.state.dashboard.settings && window.state.dashboard.settings.hero_name) || 'Admin';
            
            const replyDisplay = item.reply ? `
      <div class="mt-2 ml-10 flex items-start gap-4 opacity-95 scale-[0.98] origin-top-left transition-all bg-indigo-50/50 dark:bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20">
          <img src="${adminAvatar}" alt="${adminName}" class="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=A&background=4f46e5&color=fff&bold=true&size=56'">
          <div class="min-w-0">
              <p class="text-[9px] mb-0.5 leading-none"><span class="font-bold text-slate-900 dark:text-slate-100">${adminName}</span> <span class="text-slate-400 dark:text-slate-500 font-normal ml-1">${item.replied_at ? new Date(item.replied_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : ''}</span></p>
              <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">${item.reply}</p>
          </div>
      </div>
    ` : '';

            card.innerHTML = `
      <div class="flex items-start gap-3.5">
          <div class="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-[11px] shrink-0 border border-blue-100 dark:border-slate-700 mt-1 shadow-sm">${initial}</div>
          <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 dark:text-slate-100 text-[12px]">${guestName}</span>
                  <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold">${dateStr}</span>
              </div>
              <p class="text-[12px] text-slate-700 dark:text-slate-300 mt-0.5 leading-snug font-medium">${message}</p>
              
              <div class="flex items-center gap-2 mt-1.5">
                  <button title="${item.reply ? 'Edit balasan' : 'Balas ucapan'}" onclick="window.toggleReplyInput(this, '${item.id}')" class="text-blue-500 hover:text-blue-700 transition-colors p-1">
                      <i class="fas ${item.reply ? 'fa-edit' : 'fa-reply'} text-[11px] pointer-events-none"></i>
                  </button>
                  ${item.reply ? `<button title="Hapus balasan" onclick="window.deleteReply('${item.id}')" class="text-amber-500 hover:text-amber-700 transition-colors p-1"><i class="fas fa-times text-[11px] pointer-events-none"></i></button>` : ''}
                  <button title="Hapus ucapan" onclick="window.deleteWish('${item.id}')" class="text-rose-500 hover:text-rose-700 transition-colors p-1">
                      <i class="fas fa-trash-can text-[11px] pointer-events-none"></i>
                  </button>
              </div>

              <div id="replyBox_${item.id}" class="hidden mt-2 flex items-center gap-2">
                  <input type="text" id="replyInput_${item.id}" value="${(item.reply || '').replace(/"/g, '&quot;')}" placeholder="Tulis balasan..." class="flex-1 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 text-[10px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all">
                  <button onclick="window.submitReply(this, '${item.id}')" class="btn-premium btn-primary !h-8 !px-4 !rounded-full !text-[10px] shrink-0 font-bold">
                      Kirim
                  </button>
              </div>
          </div>
      </div>
      ${replyDisplay}
    `;
            wishContainer.appendChild(card);
        });
    }

    // Update Counts
    const totalWishes = wishes.length;
    if (document.getElementById('totalWishes')) document.getElementById('totalWishes').innerText = totalWishes;
    if (document.getElementById('totalWishesCount')) document.getElementById('totalWishesCount').innerText = totalWishes;
    
    const totalReplies = wishes.filter(w => w.reply && w.reply.trim().length > 0).length;
    if (document.getElementById('totalRepliesCount')) document.getElementById('totalRepliesCount').innerText = totalReplies;
};

window.toggleReplyInput = function(btn, id) {
    const parent = btn.closest('.flex-1');
    const box = parent.querySelector(`[id^="replyBox_"]`);
    if (!box) return;

    const isHidden = box.classList.contains('hidden');
    document.querySelectorAll('[id^="replyBox_"]').forEach(el => el.classList.add('hidden'));

    if (isHidden) {
        box.classList.remove('hidden');
        const input = box.querySelector('input');
        if (input) input.focus();
    }
};

window.submitReply = async function(btn, id) {
    const parent = btn.closest('.flex-1');
    const input = parent.querySelector('input');
    if (!input) return;
    const reply = input.value.trim();
    if (!reply) {
        showToast('Balasan tidak boleh kosong', 'error');
        return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        await api(`/api/admin/wishes/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply })
        });
        showToast('Balasan berhasil disimpan!', 'success');
        await window.loadDashboard();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
};

window.deleteReply = async function(id) {
    const lang = window.currentLang || 'id';
    window.deleteWithConfirm(async () => {
        await api(`/api/admin/wishes/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply: '' })
        });
        showToast(lang === 'id' ? 'Balasan dihapus!' : 'Reply purged!', 'success');
        await window.loadDashboard();
    }, {
        message: lang === 'id' ? 'Apakah Anda yakin ingin menghapus balasan ini?' : 'Are you sure you want to delete this reply?'
    });
};

window.deleteWish = function(id) {
    const lang = window.currentLang || 'id';
    window.deleteWithConfirm(async () => {
        await api(`/api/admin/wishes/${id}`, { method: 'DELETE' });
        await window.loadDashboard();
        showToast(lang === 'id' ? 'Ucapan berhasil dihapus.' : 'Wish deleted successfully.', 'delete');
    }, {
        message: lang === 'id' ? 'Ucapan ini akan dihapus permanen dan tidak bisa dikembalikan.' : 'This wish will be permanently deleted.'
    });
};
