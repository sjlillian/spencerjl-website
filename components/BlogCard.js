import Link from 'next/link';
import styles from './BlogCard.module.css';

export default function BlogCard({ title, date, description, slug }) {
  // Simple date formatter
  const parsedDate = date ? new Date(date) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
  const formattedDate = isValidDate
    ? parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <Link href={`/blog/${slug}`} className={styles.card}>
      {formattedDate && <time className={styles.date}>{formattedDate}</time>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
