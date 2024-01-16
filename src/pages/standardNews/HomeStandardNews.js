import styles from "./HomeStandardNews.module.css";
import { Link, useLoaderData } from "react-router-dom";
import demoData from "../../data/db.json";

const HomeStandardNews = () => {
  const articles = useLoaderData();

  return (
    <div className={styles.newsContainer}>
      <Link to={`/news/${articles[0].article_id}`}>
        <div className={styles.mainArticle}>
          <div className={styles.mainArticleContent}>
            <h1>{articles[0].title}</h1>
            <p>
              {articles[0].description} ({articles[0].category[0]})
            </p>
            <small>For the full story...</small>
          </div>
          <div className={styles.mainArticleImage}>
            <img src={articles[0].image_url} alt={articles[0].title} />
          </div>
        </div>
      </Link>
      
      <div className={styles.subArticlesContainer}>
        {articles.slice(1, 4).map((article, index) => (
          <Link to={`/news/${article.article_id}`} key={article.article_id}>
            <div className={styles.subArticle}>
              <div className={styles.subArticleImgContainer}>
                <img src={article.image_url} alt={article.title} />
              </div>
              <div
                className={styles.subArticleContent}
                style={index === 1 ? { backgroundColor: "#003366" } : {}}
              >
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.diverLine}>
        <h3>More news</h3>
      </div>

      <div className={styles.miniArticlesContainer}>        
        {articles.slice(4, 10).map((article) => (
          <Link to={`/news/${article.article_id}`} key={article.article_id}>
            <div key={article.article_id} className={styles.miniArticle}>
              <div className={styles.miniArticleImgContainer}>
                <img src={article.image_url} alt={article.title} />
              </div>
              <div className={styles.miniArticleContent}>
                <h5>{article.title}</h5>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export function newsLoader() {
  return demoData.articles;
}

export default HomeStandardNews;
