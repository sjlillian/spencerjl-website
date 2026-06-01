import { getProjectsData } from '../../lib/data';
import ProjectCard from '../../components/ProjectCard';
import styles from './projects.module.css';

export const metadata = {
  title: 'Projects | Spencer',
  description: 'A collection of software development projects.',
};

export default async function ProjectsPage() {
  const projects = await getProjectsData();

  return (
    <main className="container page-wrapper">
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.description}>
          Things I've built. From systems architecture to minimalist tools.
        </p>
      </header>
      
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </main>
  );
}
