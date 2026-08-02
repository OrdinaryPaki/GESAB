"use client";

import Link from "next/link";
import { useState } from "react";

import RevealOnView from "./RevealOnView";
import styles from "./blog.module.css";

function BlogCard({ post, variant = "article", hiddenOnMobile = false }) {
  const classes = [
    styles.blogCard,
    variant === "large" ? styles.largeCard : "",
    variant === "compact" ? styles.compactCard : "",
    variant === "article" ? styles.articleCard : "",
    hiddenOnMobile ? styles.mobileAdditionalCard : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/blog/${post.slug}`} className={classes}>
      <div className={styles.cardImageWrap}>
        <img src={post.image} alt="Blog Image" />
      </div>
      <div className={styles.cardCopy}>
        <span className={styles.category}>{post.category}</span>
        {variant === "compact" ? (
          <p className={styles.cardTitle}>{post.title}</p>
        ) : (
          <h4 className={styles.cardTitle}>{post.title}</h4>
        )}
        <p className={styles.cardExcerpt}>{post.excerpt}</p>
        <span className={styles.readMore}>
          Continue Reading <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function BlogIndexGrid({ featured, articles }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <RevealOnView className={styles.featuredReveal}>
        <div className={styles.featuredGrid}>
          <BlogCard post={featured[0]} variant="large" />
          <div className={styles.featuredSide}>
            {featured.slice(1).map((post) => (
              <BlogCard key={post.slug} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </RevealOnView>

      <section className={styles.moreArticlesSection}>
        <h2>Read More Articles</h2>
        <RevealOnView>
          <div
            className={styles.articleGrid}
            data-expanded={isExpanded ? "true" : "false"}
          >
            {articles.map((post, index) => (
              <BlogCard
                key={post.slug}
                post={post}
                hiddenOnMobile={!isExpanded && index >= 3}
              />
            ))}
          </div>
        </RevealOnView>
        {!isExpanded ? (
          <button
            type="button"
            className={styles.loadMore}
            onClick={() => setIsExpanded(true)}
          >
            Load More
          </button>
        ) : null}
      </section>
    </>
  );
}
