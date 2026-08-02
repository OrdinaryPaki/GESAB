import BlogIndexGrid from "./BlogIndexGrid";
import { getBlogIndexGroups } from "./blog-posts.mjs";
import styles from "./blog.module.css";

export const metadata = {
  title: "Latest Insights",
  description:
    "Stay informed with our latest insights and updates from emerging trends and expert tips.",
};

function toCardData(post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    category: post.category,
  };
}

export default function BlogPage() {
  const groups = getBlogIndexGroups();

  return (
    <main className={styles.indexMain}>
      <section className={styles.indexHero}>
        <h1>Latest Insights</h1>
        <p>
          Stay informed with our latest Insights and Updates
          <br className={styles.desktopBreak} /> from emerging trends and expert tips
        </p>
      </section>
      <div className={styles.indexContainer}>
        <BlogIndexGrid
          featured={groups.featured.map(toCardData)}
          articles={groups.articles.map(toCardData)}
        />
      </div>
    </main>
  );
}
