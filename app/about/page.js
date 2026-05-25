import { getAboutData } from '../../lib/data';
import styles from './about.module.css';

export const metadata = {
  title: 'About | Spencer',
  description: 'About Spencer, software developer and writer.',
};

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <main className="container page-wrapper">
      <header className={styles.header}>
        <h1 className={styles.title}>About Me</h1>
        <p className={styles.intro}>{about.intro}</p>
      </header>
      
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: about.contentHtml }} 
      />
    </main>
  );
}
