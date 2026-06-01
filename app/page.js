import Link from 'next/link';
import { getAboutData, getProjectsData, getBlogsData } from '../lib/data';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import styles from './page.module.css';

export default async function HomePage() {
  const about = await getAboutData();
  // Get top 2 projects for featured
  const featuredProjects = (await getProjectsData()).slice(0, 2);
  // Get latest blog post
  const blogs = await getBlogsData();
  const latestBlog = blogs[0];

  return (
    <main className="container page-wrapper">
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <h1 className={styles.title}>{about.name}</h1>
        <h2 className={styles.subtitle}>{about.title}</h2>
        <p className={styles.intro}>{about.intro}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <Link href="/projects" className={styles.viewAll}>View all projects →</Link>
        </div>
        <div className={styles.projectsGrid}>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Writing</h2>
          <Link href="/blog" className={styles.viewAll}>Read more →</Link>
        </div>
        <div className={styles.blogWrapper}>
          {latestBlog && <BlogCard {...latestBlog} />}
        </div>
      </section>
      
      {/* Hidden developer message */}
      <script dangerouslySetInnerHTML={{__html: `console.log("Ah, another traveler. Welcome to the console.");`}} />
    </main>
  );
}