import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = date => {
  if (!date) return 'Not published';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Not published';
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
