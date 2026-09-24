import React from 'react';
import styles from './context-banner.module.css';

export function ContextBanner({ title, description, icon, action }) {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.iconWrapper}>
        {icon ? icon : <span className={styles.defaultIcon}>ℹ️</span>}
      </div>
      <div className={styles.contentWrapper}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <p className={styles.description}>{description}</p>
      </div>
      {action && (
        <div className={styles.actionWrapper}>
          {action}
        </div>
      )}
    </div>
  );
}
