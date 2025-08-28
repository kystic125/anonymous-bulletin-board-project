package ex.anonymousBulletinBoard.repository;

import ex.anonymousBulletinBoard.article.Article;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository {
    Article save(Article article);

    Optional<Article> findById(Long id);
//    Optional<Article> findByTitle(String title);

    List<Article> findAll();

    void deleteById(Long id);

    void update(Article article);
}
