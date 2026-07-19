import Image from "next/image";
import Link from "next/link";
import ResumeActions from "./ResumeActions";
import styles from "./resume.module.css";
import type { ResumeData } from "./types";

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export interface RecentResumePost {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
}

const postDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function Resume({
  data,
  recentPosts,
  blogHref,
  feedHref,
  lastUpdated,
}: {
  data: ResumeData;
  recentPosts: RecentResumePost[];
  blogHref: string;
  feedHref: string;
  lastUpdated: string;
}) {
  const { profile, contactLinks, workExperience, skills, sideProjects } = data;
  const currentRole = workExperience[0];
  const featuredProject =
    sideProjects.find((project) => project.active) ?? sideProjects[0];
  const otherProjects = sideProjects.filter(
    (project) => project !== featuredProject,
  );
  const openSourceProject = sideProjects.find((project) =>
    project.url.startsWith("https://github.com/"),
  );

  return (
    <main id="main-content" className={styles.container} tabIndex={-1}>
      <div className={styles.content}>
        <ResumeActions feedHref={feedHref} />
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

        {currentRole && (
          <section
            className={styles.currentSection}
            aria-labelledby="currently-heading"
          >
            <p id="currently-heading">Currently</p>
            <div>
              <strong>{currentRole.position}</strong>
              <span>
                at {currentRole.company} · {profile.location}
              </span>
            </div>
          </section>
        )}

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

        <section className={styles.writingSection}>
          <div className={styles.writingHeading}>
            <h2 id="recent-writing">Recent writing</h2>
            <Link href={blogHref}>View all writing</Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className={styles.writingList}>
              {recentPosts.map((post) => (
                <article key={post.href} className={styles.writingItem}>
                  <time dateTime={post.date}>
                    {postDateFormat.format(new Date(post.date))}
                  </time>
                  <div>
                    <h3>
                      <Link href={post.href}>{post.title}</Link>
                    </h3>
                    <p>{post.summary}</p>
                    {post.tags.length > 0 && (
                      <ul className={styles.writingTags}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.writingEmpty}>New articles are coming soon.</p>
          )}
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
          {featuredProject && (
            <article className={styles.featuredProject}>
              <div>
                <p>Featured project</p>
                <h3>
                  <a
                    href={featuredProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {featuredProject.name}
                  </a>
                </h3>
                <span>{featuredProject.description}</span>
              </div>
              <ul>
                {featuredProject.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </article>
          )}
          <div className={styles.projectsGrid}>
            {otherProjects.map((project) => (
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
        {openSourceProject && (
          <section className={styles.openSourceSection}>
            <div>
              <p>Open source</p>
              <h2>{openSourceProject.name}</h2>
              <span>{openSourceProject.description}</span>
            </div>
            <a
              href={openSourceProject.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </section>
        )}
        <footer className={styles.resumeFooter}>
          Last updated{" "}
          <time dateTime={lastUpdated}>
            {postDateFormat.format(new Date(lastUpdated))}
          </time>
        </footer>
      </div>
    </main>
  );
}
