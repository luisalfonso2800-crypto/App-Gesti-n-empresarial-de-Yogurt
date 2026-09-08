import React from 'react';

// Mocking lucide-react components since it wasn't actually available in package.json
// despite the prompt's assumption. This ensures `pnpm --filter web build` works.

export const ShoppingCartIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);

export const PrintIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);

export const CheckIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export const XIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const TrashIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const StoreIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

export const AlertCircleIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export const ClockIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export const RotateCcwIcon = ({ size = 24, className = '', strokeWidth = 2, ...props }) => (
  <svg width={size} height={size} className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
);
