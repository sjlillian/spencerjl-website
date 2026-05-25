import { getBlogsData } from '../../lib/data';
import BlogCard from '../../components/BlogCard';
import styles from './blog.module.css';

export const metadata = {
  title: 'Blog | Spencer',
  description: 'Thoughts on software development, systems, and design.',
};

export default function BlogPage() {
  const blogs = getBlogsData();

  return (
    <main className="container page-wrapper">
      <header className={styles.header}>
        <h1 className={styles.title}>Writing</h1>
        <p className={styles.description}>
          Occasional thoughts on software engineering, architecture, and systems thinking.
        </p>
      </header>
      
      <div className={styles.list}>
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} {...blog} />
        ))}
      </div>
    </main>
  );
}
