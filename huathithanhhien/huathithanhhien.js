const API_URL = "http://localhost:1880/timkiem";

document.addEventListener('DOMContentLoaded', () => {
  const API = 'http://localhost:1880/timkiem?=';
  const qInput = document.getElementById('q');
  const filterSelect = document.getElementById('filterClass');
  const searchBtn = document.getElementById('searchBtn');
  const statusEl = document.getElementById('status');
  const resultsEl = document.getElementById('results');

  let originalData = [];

  function setStatus(text, isError = false) {
    statusEl.textContent = text || '';
    statusEl.style.color = isError ? '#ffb3b3' : '';
  }

  // Function to build query URL with parameters
  function buildQueryUrl(query) {
    const url = new URL(API_URL);
    if (query) url.searchParams.append('q', query);
    return url.toString();
  }

  async function fetchData(query) {
    const url = buildQueryUrl(query);
    setStatus('Đang tải dữ liệu...');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const data = await res.json();

      if (!Array.isArray(data)) {
        // allow for Node-RED to return object with payload
        if (data && Array.isArray(data.payload)) originalData = data.payload;
        else throw new Error('Dữ liệu trả về không đúng định dạng.');
      } else {
        originalData = data;
      }

      setStatus(`Đã tải ${originalData.length} mục.`);
      populateClassFilter(originalData);
      renderResults(originalData);
    } catch (err) {
      console.error('Fetch error', err);
      setStatus('Không thể tải dữ liệu từ server. Kiểm tra Node-RED và CORS.', true);
      resultsEl.innerHTML = '';
    }
  }

  function populateClassFilter(items) {
    const classes = Array.from(new Set(items.map(i => (i.Lop || i.lop || '').toString().trim()).filter(Boolean))).sort();
    // clear existing except first option
    filterSelect.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());
    classes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterSelect.appendChild(opt);
    });
  }

  function renderResults(items) {
    resultsEl.innerHTML = '';
    if (!items || items.length === 0) {
      resultsEl.innerHTML = '<div style="color:var(--muted);padding:18px">Không có kết quả</div>';
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((it, idx) => {
      const card = document.createElement('article');
      card.className = 'card show';
      card.setAttribute('data-index', idx);

      const name = it.HoTen || it.hoTen || it.name || '—';
      const id = (it.MaSV !== undefined && it.MaSV !== null) ? it.MaSV : (it.masv || it.id || '—');
      const lop = it.Lop || it.lop || '—';
      const diem = (it.DiemTB !== undefined && it.DiemTB !== null) ? it.DiemTB : (it.diemTB || it.Diem || '—');
      const ngaySinh = it.NgaySinh || it.ngaySinh || 'Không rõ';

      // Optional fields from your SQL join: TenMH (môn), SoTinChi, Diem
      const tenMH = it.TenMH || it.tenMH || it.Mon || it.mon || undefined;
      const soTC = it.SoTinChi || it.soTinChi || it.tinchi || undefined;
      const diemMon = it.Diem !== undefined ? it.Diem : (it.diem || undefined);

      const initials = name.split(' ').filter(Boolean).slice(-2).map(s => s[0].toUpperCase()).join('') || '?';

      const chipsHtml = [
        tenMH ? `<span class="chip" title="Môn học">${escapeHtml(String(tenMH))}</span>` : '',
        soTC ? `<span class="chip" title="Số tín chỉ">${escapeHtml(String(soTC))} TC</span>` : '',
        diemMon !== undefined ? `<span class="chip" title="Điểm môn">Điểm: ${escapeHtml(String(diemMon))}</span>` : ''
      ].filter(Boolean).join('');

      card.innerHTML = `
        <div class="head">
          <div class="avatar" aria-hidden="true">${initials}</div>
          <div>
            <div class="name">${escapeHtml(name)}</div>
            <div class="meta">Mã: ${escapeHtml(String(id))} • Lớp: ${escapeHtml(lop)}</div>
          </div>
        </div>
        <div class="meta">Ngày sinh: ${escapeHtml(ngaySinh)}</div>
        <div class="chips">${chipsHtml}</div>
        <div class="meta" style="margin-top:8px">Điểm trung bình</div>
        <div class="score"><span class="badge">${escapeHtml(String(diem))}</span></div>
      `;

      frag.appendChild(card);
    });

    resultsEl.appendChild(frag);

    // small stagger animation using CSS variable
    Array.from(resultsEl.children).forEach((c, i) => {
      c.style.animationDelay = (i * 45) + 'ms';
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function filterAndRender() {
    const q = qInput.value.trim().toLowerCase();
    const cls = filterSelect.value;

    const filtered = originalData.filter(it => {
      const name = (it.HoTen || it.hoTen || it.name || '').toString().toLowerCase();
      const lop = (it.Lop || it.lop || '').toString();
      const id = (it.MaSV || it.masv || it.id || '').toString();

      const matchQ = !q || name.includes(q) || lop.toLowerCase().includes(q) || id.includes(q);
      const matchClass = !cls || lop === cls;
      return matchQ && matchClass;
    });

    setStatus(`Hiển thị ${filtered.length} / ${originalData.length}`);
    renderResults(filtered);
  }

  // wire events
  searchBtn.addEventListener('click', () => {
    const query = qInput.value.trim();
    fetchData(query);
  });

  qInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = qInput.value.trim();
      fetchData(query);
    }
  });

  filterSelect.addEventListener('change', () => filterAndRender());

  // initial load
  fetchData();

  // expose for debugging
  window.__htth = { fetchData, filterAndRender };
});