package ex.anonymousBulletinBoard.controller;

import ex.anonymousBulletinBoard.article.Article;
import ex.anonymousBulletinBoard.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MainController {
    private final ArticleService articleService;

    @GetMapping("/")
    public String home() {
        return "redirect:/html/mainPage.html";
    }

    @GetMapping("/articles")
    public String articleList(Model model) {
        List<Article> articles = articleService.findArticles();
        model.addAttribute("articles", articles);
        return "redirect:/html/articleList.html";
    }

    @PostMapping("/post")
    public String createPost(Article form) {
        Article article = new Article();
        article.setTitle(form.getTitle());
        article.setContent(form.getContent());
        article.setPassword(form.getPassword());

        articleService.post(article);

        return "redirect:/html/articleList.html";
    }

    @GetMapping("/post")
    public String showPostForm() {
        return "redirect:/html/postForm.html";
    }

    @GetMapping("/article/{id}")
    public String articlePage() {
        return "forward:/html/articleDetail.html";
    }

    @GetMapping("/update/{id}")
    public String updatePage() {
        return "forward:/html/updateForm.html";
    }
}
