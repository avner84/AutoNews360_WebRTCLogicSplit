import styles from "./HomeAvatarNews.module.css";
import { Link, useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

import demoData from "../../data/db.json";
import SofiaAvatar from "./avatarImages/Sofia-image.png";
import JackAvatar from './avatarImages/Jack-image.png'

const HomeAvatarNews = () => {

  const articles = useLoaderData();

  return (
    <div className={styles.avatarNewsContainer}>
      <header className={styles.header}>
        <h1>Beyond Words: Avatars Bring News to Life in the Virtual World</h1>
        <h2>
          Click on an article to watch it presented by an Avatar, an innovative
          experience in news reading!
        </h2>
      </header>
      <div className={styles.mainArticlesContainer}>
        {articles.slice(0, 2).map((article, index) => (
          <div key={article.article_id}>
            <Link to={`/avatars/${article.article_id}`}>
              <img                
                src={index === 0 ? SofiaAvatar : JackAvatar}
                alt={article.title}
              />
              <h2>
                <FontAwesomeIcon icon={faVideo} /> {article.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>
      <div className={styles.miniArticlesContainer}>
        {articles.slice(2, 10).map((article) => (
          <div key={article.article_id}>
            <Link to={`/avatars/${article.article_id}`}>
              <img src={article.image_url} alt={article.title} />
              <h4>
                <FontAwesomeIcon icon={faVideo} /> {article.title}
              </h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export function avatarNewsLoader() {
  return demoData.articles;
}

export default HomeAvatarNews;
