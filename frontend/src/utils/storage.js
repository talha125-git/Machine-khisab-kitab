const API_URL = 'http://localhost:5000/api/kitabs';

function getHeaders() {
  const user = JSON.parse(localStorage.getItem('khisab_user') || 'null');
  return {
    'Content-Type': 'application/json',
    ...(user && user.id ? { 'x-user-id': user.id } : {}),
  };
}

/**
 * Get all kitabs from backend
 */
export async function getKitabList() {
  try {
    const res = await fetch(API_URL, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch kitabs');
    const kitabs = await res.json();
    return kitabs;
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Save a single kitab (used for both creating and updating)
 */
export async function saveKitab(kitab) {
  try {
    const existing = await getKitab(kitab.id);
    if (existing) {
      // Update
      const res = await fetch(`${API_URL}/${kitab.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(kitab),
      });
      if (!res.ok) throw new Error('Failed to update kitab');
      return await res.json();
    } else {
      // Create
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(kitab),
      });
      if (!res.ok) throw new Error('Failed to create kitab');
      return await res.json();
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Get a single kitab by ID
 */
export async function getKitab(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch kitab');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Delete a single kitab
 */
export async function deleteKitab(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete kitab');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Create a new kitab
 */
export async function createKitab(startDate, existingKitabsCount) {
  const id = `kitab_${Date.now()}`;
  const start = new Date(startDate);
  
  // Generate 15 day entries
  const days = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      dayNumber: i + 1,
      date: date.toISOString().split('T')[0],
      income: '',
      notes: '',
      saved: false,
    });
  }

  // Format title
  const endDate = new Date(start);
  endDate.setDate(start.getDate() + 14);
  
  const kitab = {
    id,
    title: formatKitabTitle(existingKitabsCount + 1, start, endDate),
    number: existingKitabsCount + 1,
    startDate: start.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    days,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  return await saveKitab(kitab);
}

/**
 * Format kitab title
 */
function formatKitabTitle(number, start, end) {
  const opts = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  return `Kitab #${number} – ${startStr} to ${endStr}`;
}

/**
 * Format date to display string
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get day name from date string
 */
export function getDayName(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Calculate kitab statistics
 */
export function getKitabStats(kitab) {
  const filledDays = kitab.days.filter(d => d.saved && d.income !== '');
  const totalIncome = filledDays.reduce((sum, d) => sum + (parseFloat(d.income) || 0), 0);
  const daysCompleted = filledDays.length;
  const daysRemaining = 15 - daysCompleted;
  const avgIncome = daysCompleted > 0 ? totalIncome / daysCompleted : 0;
  const progress = (daysCompleted / 15) * 100;

  return {
    totalIncome,
    avgIncome,
    daysCompleted,
    daysRemaining,
    progress,
  };
}

/**
 * Format currency in PKR
 */
export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
