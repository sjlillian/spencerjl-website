import { getBlogBySlug, getBlogsData } from '../../../lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './slug.module.css';

export async function generateStaticParams() {
  const blogs = getBlogsData();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export function generateMetadata({ params }) {
  const blog = getBlogBySlug(params.slug);
  if (!blog) return { title: 'Not Found' };
  
  return {
    title: `${blog.title} | Spencer`,
    description: blog.description,
  };
}

export default function BlogPost({ params }) {
  const blog = getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="container page-wrapper">
      <Link href="/blog" className={styles.backLink}>← Back to writing</Link>
      
      <article className={styles.article}>
        <header className={styles.header}>
          <time className={styles.date}>{formattedDate}</time>
          <h1 className={styles.title}>{blog.title}</h1>
        </header>
        
        <div className={styles.content}>
          <p><em>This is a placeholder for the blog content. Eventually, this could render Markdown or MDX based on the slug.</em></p>
          <p>{blog.description}</p>
        </div>
      </article>
    </main>
  );
}
