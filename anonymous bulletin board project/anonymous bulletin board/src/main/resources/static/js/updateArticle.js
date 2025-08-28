// updateArticle.js

async function updateArticle(articleId, password, title, content) {
    const response = await fetch(`/update/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            title,
            content
        })
    });

    const result = await response.json();
    if (result.success) {
        alert('수정 완료');
        window.location.href = `/article/${articleId}`;
    } else {
        alert(result.message || '수정 실패');
    }
}

// 예시 사용법 (폼 제출 이벤트에 연결)
document.getElementById('updateForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const articleId = e.target.dataset.articleId;
    const password = e.target.querySelector('input[name="password"]').value;
    const title = e.target.querySelector('input[name="title"]').value;
    const content = e.target.querySelector('textarea[name="content"]').value;

    updateArticle(articleId, password, title, content);
});
