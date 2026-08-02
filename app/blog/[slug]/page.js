import Link from "next/link";
import { notFound } from "next/navigation";

import RevealOnView from "../RevealOnView";
import { blogPosts, getBlogPostBySlug } from "../blog-posts.mjs";
import styles from "../blog.module.css";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.detailMain}>
      <section className={styles.detailHero}>
        <div className={styles.detailHeroInner}>
          <div className={styles.detailTitleBlock}>
            <p className={styles.detailDate}>{post.date}</p>
            <h1>{post.title}</h1>
          </div>
          <img className={styles.detailLeadImage} src={post.image} alt="Blog Image" />
        </div>
      </section>

      <article className={styles.detailArticle}>
        <RevealOnView>
          <p className={styles.detailIntro}>{post.intro}</p>
        </RevealOnView>

        {post.sections.map((section, index) => {
          const Heading = section.level === 3 ? "h3" : "h4";
          const isLastSection = index === post.sections.length - 1;

          return (
            <RevealOnView
              key={section.heading}
              className={[
                styles.articleBlockReveal,
                isLastSection ? styles.lastArticleBlockReveal : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <section
                className={[
                  styles.articleBlock,
                  section.showDetailImageAfter ? styles.articleBlockWithImage : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Heading>{section.heading}</Heading>
                <p>{section.body}</p>
                {section.showDetailImageAfter ? (
                  <img
                    className={styles.detailSecondaryImage}
                    src={post.detailImage}
                    alt="Details Image"
                  />
                ) : null}
              </section>
            </RevealOnView>
          );
        })}

        <RevealOnView>
          <Link href="/blog" className={styles.goBack}>
            Go Back
          </Link>
        </RevealOnView>
      </article>
    </main>
  );
}
