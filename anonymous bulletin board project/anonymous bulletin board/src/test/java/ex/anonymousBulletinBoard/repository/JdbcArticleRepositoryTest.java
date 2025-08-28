package ex.anonymousBulletinBoard.repository;

import ex.anonymousBulletinBoard.article.Article;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JdbcArticleRepositoryTest {

    @Autowired
    private ArticleRepository articleRepository;

    @Test
    void saveAndFindByIdTest() {
        Article article = new Article();
        article.setTitle("테스트 제목");
        article.setContent("테스트 내용");
        article.setPassword("1234");

        Article saved = articleRepository.save(article);
        assertNotNull(saved.getId());

        Optional<Article> found = articleRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("테스트 제목", found.get().getTitle());
    }
}