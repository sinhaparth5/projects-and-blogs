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
  const {
    profile,
    contactLinks,
    workExperience,
    skills,
    skillCategories,
    sideProjects,
    education,
    publications,
    hackathons,
  } = data;
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
                    <h4 className={styles.workPosition}>
                      {job.position}
                      {job.location ? ` · ${job.location}` : ""}
                    </h4>
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

        {education && education.length > 0 && (
          <section className={styles.educationSection}>
            <h2 id="education-section">Education</h2>
            <div className={styles.educationList}>
              {education.map((edu) => (
                <article
                  key={`${edu.institution}-${edu.period}`}
                  className={styles.educationItem}
                >
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
        )}

        {publications && publications.length > 0 && (
          <section className={styles.publicationsSection}>
            <h2 id="publications">Publications</h2>
            <div className={styles.publicationsList}>
              {publications.map((pub) => (
                <article key={pub.title} className={styles.publicationItem}>
                  <div className={styles.publicationHeader}>
                    <h3 className={styles.publicationTitle}>{pub.title}</h3>
                    <div className={styles.publicationMeta}>
                      <span className={styles.publicationStatus}>
                        {pub.status}
                      </span>
                      <span className={styles.publicationPeriod}>
                        {pub.period}
                      </span>
                    </div>
                  </div>
                  <div className={styles.publicationAuthors}>{pub.authors}</div>
                  <div className={styles.publicationVenue}>{pub.venue}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        {hackathons && hackathons.length > 0 && (
          <section className={styles.hackathonsSection}>
            <h2 id="hackathons">Hackathons</h2>
            <p className={styles.sectionIntro}>
              9+ hackathon wins — a glimpse of recent highlights.
            </p>
            <div className={styles.hackathonsList}>
              {hackathons.map((hackathon) => (
                <article
                  key={`${hackathon.title}-${hackathon.period}`}
                  className={styles.hackathonItem}
                >
                  <div className={styles.hackathonHeader}>
                    <h3 className={styles.hackathonTitle}>
                      {hackathon.title}
                      <span className={styles.hackathonResult}>
                        {hackathon.result}
                      </span>
                    </h3>
                    <div className={styles.hackathonPeriod}>
                      {hackathon.period} · {hackathon.location}
                    </div>
                  </div>
                  <div className={styles.hackathonProject}>
                    Project: <strong>{hackathon.project}</strong>
                  </div>
                  <div className={styles.hackathonDescription}>
                    {hackathon.description}
                  </div>
                  {hackathon.highlights && (
                    <ul className={styles.hackathonHighlights}>
                      {hackathon.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.hackathonFooter}>
                    <ul className={styles.hackathonTags}>
                      {hackathon.tags.map((tag) => (
                        <li key={tag}>
                          <div className={styles.tag}>{tag}</div>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={hackathon.linkedin}
                      className={styles.hackathonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View LinkedIn post →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
          {skillCategories ? (
            <div className={styles.skillsCategories}>
              {Object.entries(skillCategories).map(
                ([category, categorySkills]) => (
                  <div key={category} className={styles.skillCategory}>
                    <h3 className={styles.skillCategoryTitle}>{category}</h3>
                    <ul className={styles.skillsList}>
                      {categorySkills.map((skill) => (
                        <li key={skill}>
                          <div className={styles.skillTag}>{skill}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          ) : (
            <ul className={styles.skillsList}>
              {skills.map((skill) => (
                <li key={skill}>
                  <div className={styles.skillTag}>{skill}</div>
                </li>
              ))}
            </ul>
          )}
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
