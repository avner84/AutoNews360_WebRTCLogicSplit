import styles from "./NewsArticle.module.css";
import { useLoaderData } from 'react-router-dom';
import demoData from "../../data/db.json";

const NewsArticle = () => {

  const article = useLoaderData();
  

  return (
    <div className={styles.articleContainer}>
      <h1>{article.title}</h1>
      <h2>{article.description}</h2>
      <hr />
      <div className={styles.articleDetails}>
        <p className={styles.category}>
          category: {article.category[0]}
        </p>
        <p className={styles.publishDate}>{article.pubDate}</p>
      </div>
      <img
        src={article.image_url}
        alt={article.title}
      />
      <p className={styles.content}>{article.content}</p>
    </div>
  );
};

export function articleLoader({ params }) {
  const articleId = params.id;
  const article = demoData.articles.find(article=>article.article_id===articleId )
  return article;
}

export default NewsArticle;
