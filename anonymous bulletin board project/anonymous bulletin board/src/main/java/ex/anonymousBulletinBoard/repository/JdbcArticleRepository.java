package ex.anonymousBulletinBoard.repository;

import ex.anonymousBulletinBoard.article.Article;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@Primary
public class JdbcArticleRepository implements ArticleRepository {

    private final JdbcTemplate jdbcTemplate;


    public JdbcArticleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Article save(Article article) {
        SimpleJdbcInsert jdbcInsert = new SimpleJdbcInsert(jdbcTemplate);
        jdbcInsert.withTableName("ARTICLE").usingGeneratedKeyColumns("id");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("title", article.getTitle());
        parameters.put("content", article.getContent());
        parameters.put("password", article.getPassword());

        Number key = jdbcInsert.executeAndReturnKey(new MapSqlParameterSource(parameters));
        article.setId(key.longValue());
        return article;
    }

    @Override
    public Optional<Article> findById(Long id) {
        List<Article> result = jdbcTemplate.query("select * from article where id = ?", articleRowMapper(), id);
        return result.stream().findAny();
    }

//    @Override
//    public Optional<Article> findByTitle(String title) {
//        List<Article> result = jdbcTemplate.query("SELECT * FROM article WHERE title = ?", articleRowMapper(), title);
//        return result.stream().findAny();
//    }

    @Override
    public List<Article> findAll() {
        return jdbcTemplate.query("select * from article", articleRowMapper());
    }

    @Override
    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM article WHERE id = ?", id);
    }

    @Override
    public void update(Article article) {
        String sql = "UPDATE ARTICLE SET TITLE = ?, CONTENT = ? WHERE ID = ?";
        jdbcTemplate.update(sql, article.getTitle(), article.getContent(), article.getId());
    }

    private RowMapper<Article> articleRowMapper() {
        return (RowMapper<Article>) (rs, rowNum) -> {
            Article article = new Article();
            article.setId(rs.getLong("id"));
            article.setTitle(rs.getString("title"));
            article.setContent(rs.getString("content"));
            article.setPassword(rs.getString("password"));
            return article;
        };
    }
}