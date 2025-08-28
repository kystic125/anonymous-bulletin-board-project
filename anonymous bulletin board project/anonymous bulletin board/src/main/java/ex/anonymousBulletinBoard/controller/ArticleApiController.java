package ex.anonymousBulletinBoard.controller;

import ex.anonymousBulletinBoard.article.Article;
import ex.anonymousBulletinBoard.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArticleApiController {
    private final ArticleService articleService;

    @GetMapping("/articles")
    public List<Article> getArticles() {
        return articleService.findArticles();
    }

    @GetMapping("/article/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        return articleService.findArticle(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/delete/{id}")
    public Map<String, Object> deleteArticle(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String inputPassword = body.get("password");
            checkPassword(id, inputPassword);
            articleService.deleteArticle(id);
            return Map.of("success", true, "message", "삭제 완료");
        } catch (IllegalArgumentException e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    @PostMapping("/update/{id}")
    public Map<String, Object> updateArticle(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String inputPassword = body.get("password");
            checkPassword(id, inputPassword);
            articleService.updateArticle(id, body.get("title"), body.get("content"));
            return Map.of("success", true, "message", "수정 완료");
        } catch (IllegalArgumentException e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    private void checkPassword(Long id, String inputPassword) {
        Article article = articleService.findArticle(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        if (!article.getPassword().equals(inputPassword)) {
            throw new IllegalArgumentException("비밀번호가 틀립니다.");
        }

    }
}