export const fetchWithRetry = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetch:', error);
    throw error;
  }
};

export const syncWithMongoDB = async (userData, API_BASE_URL) => {
  return await fetchWithRetry(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
};
