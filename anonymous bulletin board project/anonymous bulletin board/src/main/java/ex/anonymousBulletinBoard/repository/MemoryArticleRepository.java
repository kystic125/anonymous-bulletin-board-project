package ex.anonymousBulletinBoard.repository;

import ex.anonymousBulletinBoard.article.Article;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class MemoryArticleRepository implements ArticleRepository {

    private static final Map<Long, Article> articles = new HashMap<>();
    private static long sequence = 0L;

    @Override
    public Article save(Article article) {
        if(article.getId() == null) {
            article.setId(++sequence);
        }
        articles.put(article.getId(), article);
        return article;
    }

    @Override
    public Optional<Article> findById(Long id) {
        return Optional.ofNullable(articles.get(id));
    }

//    @Override
//    public Optional<Article> findByTitle(String title) {
//        return articles.values().stream()
//                .filter(member -> member.getTitle().equals(title))
//                .findAny();
//    }

    @Override
    public List<Article> findAll() {
        return new ArrayList<>(articles.values());
    }

    @Override
    public void deleteById(Long id) {
        articles.remove(id);
    }

    @Override
    public void update(Article article) {
        articles.put(article.getId(), article);
    }
}
