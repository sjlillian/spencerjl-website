import { getAboutData } from '../../lib/data';
import styles from './about.module.css';

export const metadata = {
  title: 'About | Spencer',
  description: 'About Spencer, software developer and writer.',
};

export default function AboutPage() {
  const about = getAboutData();

  return (
    <main className="container page-wrapper">
      <header className={styles.header}>
        <h1 className={styles.title}>About Me</h1>
        <p className={styles.intro}>{about.intro}</p>
      </header>
      
      <div className={styles.sections}>
        {about.sections.map((section, index) => (
          <section key={index} className={styles.section}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            <p className={styles.sectionContent}>{section.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
