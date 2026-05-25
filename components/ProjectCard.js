import styles from './ProjectCard.module.css';

export default function ProjectCard({ title, description, stack, github }) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.stack}>
          {stack.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <a href={github} target="_blank" rel="noopener noreferrer" className={styles.link}>
          View on GitHub
        </a>
      </div>
    </div>
  );
}
