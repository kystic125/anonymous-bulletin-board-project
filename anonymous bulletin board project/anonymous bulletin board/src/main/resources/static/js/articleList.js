// 게시글 목록을 불러와 화면에 표시하는 스크립트

document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
});

async function loadArticles() {
    const listDiv = document.getElementById('articleList');

    try {
        const response = await fetch('/api/articles');

        if (!response.ok) {
            // 서버 응답이 성공적이지 않을 경우, 에러 메시지 표시
            throw new Error('게시글을 불러오는 데 실패했습니다.');
        }

        const articles = await response.json();

        listDiv.innerHTML = ''; // 기존 내용 초기화

        if (articles.length === 0) {
            // 게시글이 없을 경우 문구 표시
            listDiv.textContent = '등록된 게시글이 없습니다.';
            listDiv.style.textAlign = 'center';
            listDiv.style.marginTop = '20px';
            return;
        }

        const ul = document.createElement('ul');
        articles.forEach(article => {
            const li = document.createElement('li');
            li.textContent = article.title;
            li.onclick = () => {
                // 게시글 클릭 시 상세 페이지로 이동
                window.location.href = `/article/${article.id}`;
            };
            ul.appendChild(li);
        });

        listDiv.appendChild(ul);

    } catch (error) {
        listDiv.textContent = error.message;
        listDiv.style.color = 'red';
        listDiv.style.textAlign = 'center';
        listDiv.style.marginTop = '20px';
    }
}