import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>© {new Date().getFullYear()} Spencer</p>
        <div className={styles.links}>
          <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="/blog">Writing</a>
        </div>
      </div>
    </footer>
  );
}
