export const Truncate = (string, maxLength) => {
  if (string.length > maxLength) {
    return string.slice(0, maxLength) + '...';
  }
  return string;
};
