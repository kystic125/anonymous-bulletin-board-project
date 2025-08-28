package ex.anonymousBulletinBoard.service;

import ex.anonymousBulletinBoard.article.Article;
import ex.anonymousBulletinBoard.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public void post(Article article) {
        articleRepository.save(article);
    }

    public List<Article> findArticles() {
        return articleRepository.findAll();
    }

    public Optional<Article> findArticle(Long articleId) {
        return articleRepository.findById(articleId);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);

    }

        public void updateArticle(Long id, String newTitle, String newContent) {
            Article article = articleRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("글이 존재하지 않습니다"));
            article.setTitle(newTitle);
            article.setContent(newContent);
            articleRepository.update(article);
        }
}
