// deleteArticle.js

async function deleteArticle(articleId, password) {
    const response = await fetch(`/delete/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });

    const result = await response.json();
    if (result.success) {
        alert('삭제 완료');
        window.location.href = '/articles';
    } else {
        alert(result.message || '삭제 실패');
    }
}

// 예시 사용법 (삭제 버튼 클릭 시)
document.getElementById('deleteBtn')?.addEventListener('click', () => {
    // const articleId = /* 글 id 가져오기 */;
    const password = prompt('비밀번호를 입력하세요:');
    if (password) {
        deleteArticle(articleId, password);
    }
});
