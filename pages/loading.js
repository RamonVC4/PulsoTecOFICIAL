let pendingRequests = 0;
const loader = document.getElementById('global-loader');

export function showLoader() {
  pendingRequests++;
  if (loader) loader.hidden = false;
}

export function hideLoader() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (loader && pendingRequests === 0) loader.hidden = true;
}

export async function apiFetch(url, options) {
  showLoader();
  try {
    const res = await fetch(url, options);
    return res;
  } finally {
    hideLoader();
  }
}
