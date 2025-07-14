import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        {children}
      </table>
    </div>
  );
};

export default Table;
