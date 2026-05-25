import Link from 'next/link';
import styles from './BlogCard.module.css';

export default function BlogCard({ title, date, description, slug }) {
  // Simple date formatter
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link href={`/blog/${slug}`} className={styles.card}>
      <time className={styles.date}>{formattedDate}</time>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
