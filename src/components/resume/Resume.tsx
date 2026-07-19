import Image from "next/image";
import styles from "./resume.module.css";
import type { ResumeData } from "./types";

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export default function Resume({ data }: { data: ResumeData }) {
  const {
    profile,
    contactLinks,
    workExperience,
    education,
    skills,
    sideProjects,
  } = data;

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.profileInfo}>
            <h1>{profile.name}</h1>
            <p className={styles.description}>{profile.description}</p>
            <div className={styles.location}>
              <a
                className={styles.profileLocation}
                href={profile.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.contactLink}>
                  <Image
                    src="/cv/icons/browser.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </span>
                <p>{profile.location}</p>
              </a>
            </div>

            <div className={styles.contactLinks}>
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.contactLink}
                  aria-label={link.label}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Image
                    src={link.icon}
                    alt={link.label}
                    width={20}
                    height={20}
                  />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.profileImage}>
            {profile.image ? (
              <Image
                src={profile.image}
                alt={`Image of ${profile.name}`}
                width={120}
                height={120}
              />
            ) : (
              <div className={styles.avatarFallback} aria-hidden="true">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className={styles.aboutInfo}>
            <h2>About</h2>
            <div className={styles.aboutDescription}>{profile.about}</div>
          </div>
        </div>

        <section className={styles.workExperience}>
          <h2 id="work-experience">Work Experience</h2>
          <div className={styles.workList}>
            {workExperience.map((job) => (
              <article
                key={`${job.company}-${job.period}`}
                className={styles.workItem}
              >
                <div className={styles.workContent}>
                  <div className={styles.workHeader}>
                    <div className={styles.workTitleSection}>
                      <h3 className={styles.workCompany}>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {job.company}
                        </a>
                        <ul
                          className={`${styles.workTags} ${styles.workTagsDesktop}`}
                        >
                          {job.tags.map((tag) => (
                            <li key={tag}>
                              <div className={styles.tag}>{tag}</div>
                            </li>
                          ))}
                        </ul>
                      </h3>
                      <div className={styles.workPeriod}>{job.period}</div>
                    </div>
                    <h4 className={styles.workPosition}>{job.position}</h4>
                  </div>
                  <div className={styles.workDescription}>
                    <div className={styles.workSummary}>{job.description}</div>
                    {job.details && (
                      <ul className={styles.workDetails}>
                        {job.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    <div className={styles.workTagsMobile}>
                      <ul className={styles.workTags}>
                        {job.tags.map((tag) => (
                          <li key={tag}>
                            <div className={styles.tag}>{tag}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.educationSection}>
          <h2 id="education-section">Education</h2>
          <div className={styles.educationList}>
            {education.map((edu) => (
              <article key={edu.institution} className={styles.educationItem}>
                <div className={styles.educationContent}>
                  <div className={styles.educationHeader}>
                    <h3 className={styles.educationInstitution}>
                      {edu.institution}
                    </h3>
                    <div className={styles.educationPeriod}>{edu.period}</div>
                  </div>
                  <div className={styles.educationDegree}>{edu.degree}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.skillsSection}>
          <h2 id="skills-section">Skills</h2>
          <ul className={styles.skillsList}>
            {skills.map((skill) => (
              <li key={skill}>
                <div className={styles.skillTag}>{skill}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.projectsSection}>
          <h2 id="side-projects">Side projects</h2>
          <div className={styles.projectsGrid}>
            {sideProjects.map((project) => (
              <article key={project.name} className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectTitleSection}>
                      <h3 className={styles.projectTitle}>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.name}
                          {project.active && (
                            <span className={styles.activeIndicator} />
                          )}
                        </a>
                        <div className={styles.projectUrl}>
                          {stripProtocol(project.url)}
                        </div>
                      </h3>
                      <p className={styles.projectDescription}>
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className={styles.projectFooter}>
                    <ul className={styles.projectTags}>
                      {project.technologies.map((tech) => (
                        <li key={tech}>
                          <div className={styles.projectTag}>{tech}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
