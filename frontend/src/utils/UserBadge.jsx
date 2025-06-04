export const UserBadge = (createdAt) => {
  if (!createdAt) return null;

  const joined = new Date(createdAt);
  const now = new Date();
  const diffInMonths =
    (now.getFullYear() - joined.getFullYear()) * 12 +
    (now.getMonth() - joined.getMonth());

  const tiers = [
    {
      minMonths: 18,
      label: 'Ancient One',
      color: 'bg-gradient-to-r from-[#3e065f] via-[#9c27b0] to-[#ffe082] text-white',
      glow: 'shadow-[0_0_12px_2px_rgba(255,224,130,0.45)]',
    },
    {
      minMonths: 16,
      label: 'Legendary',
      color: 'bg-gradient-to-r from-[#4a003f] via-[#e91e63] to-[#ffcdd2] text-white',
      glow: 'shadow-[0_0_12px_2px_rgba(233,30,99,0.4)]',
    },
    {
      minMonths: 14,
      label: 'Ascendant',
      color: 'bg-gradient-to-r from-[#1a0033] via-[#7c3aed] to-[#c084fc] text-white',
      glow: 'shadow-[0_0_12px_2px_rgba(192,132,252,0.4)]',
    },
    {
      minMonths: 12,
      label: 'Supreme',
      color: 'bg-gradient-to-r from-[#001f3f] via-[#00bcd4] to-[#00ffe0] text-white',
      glow: 'shadow-[0_0_12px_3px_rgba(0,255,224,0.4)]',
    },
    {
      minMonths: 10,
      label: 'Elite',
      color: 'bg-gradient-to-r from-[#ff8c00] via-[#ffb300] to-[#ffe600] text-white',
      glow: 'shadow-[0_0_12px_3px_rgba(255,230,0,0.45)]',
    },
    {
      minMonths: 8,
      label: 'Master',
      color: 'bg-gradient-to-r from-[#ff5722] via-[#ff9800] to-[#ffcc80] text-white',
      glow: 'shadow-[0_0_12px_3px_rgba(255,204,128,0.45)]',
    },
    {
      minMonths: 6,
      label: 'Expert',
      color: 'bg-gradient-to-r from-[#c51162] via-[#f50057] to-[#ff4081] text-white',
      glow: 'shadow-[0_0_12px_3px_rgba(255,64,129,0.4)]',
    },
    {
      minMonths: 4,
      label: 'Journeyman',
      color: 'bg-gradient-to-r from-[#3949ab] via-[#5c6bc0] to-[#9fa8da] text-white',
      glow: 'shadow-[0_0_10px_2px_rgba(159,168,218,0.4)]',
    },
    {
      minMonths: 2,
      label: 'Apprentice',
      color: 'bg-gradient-to-r from-[#1976d2] via-[#64b5f6] to-[#bbdefb] text-white',
      glow: 'shadow-[0_0_10px_2px_rgba(187,222,251,0.35)]',
    },
    {
      minMonths: 0,
      label: 'Novice',
      color: 'bg-gradient-to-r from-[#455a64] via-[#607d8b] to-[#cfd8dc] text-white',
      glow: 'shadow-[0_0_8px_2px_rgba(207,216,220,0.3)]',
    },
  ];

  const badge = tiers.find((tier) => diffInMonths >= tier.minMonths);
  return badge || null;
};
