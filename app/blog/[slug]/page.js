import { getBlogBySlug, getBlogsData } from '../../../lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './slug.module.css';

export async function generateStaticParams() {
  const blogs = await getBlogsData();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  if (!blog) return { title: 'Not Found' };
  
  return {
    title: `${blog.title} | Spencer`,
    description: blog.description,
  };
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  
  if (!blog) {
    notFound();
  }

  const parsedDate = blog.date ? new Date(blog.date) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
  const formattedDate = isValidDate
    ? parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <main className="container page-wrapper">
      <Link href="/blog" className={styles.backLink}>← Back to writing</Link>
      
      <article className={styles.article}>
        <header className={styles.header}>
          {formattedDate && <time className={styles.date}>{formattedDate}</time>}
          <h1 className={styles.title}>{blog.title}</h1>
        </header>
        
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
        />
      </article>
    </main>
  );
}
