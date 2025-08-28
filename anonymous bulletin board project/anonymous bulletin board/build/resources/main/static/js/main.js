// 메인 페이지에서 [입장] 버튼 클릭 시 -> 그냥 HTML에 onclick 있어 따로 코드 필요 없음

// 게시글 리스트 페이지
function setupArticleList() {
    const table = document.getElementById('articleTable');
    if (!table) return;

    // 테이블 행 클릭 시 상세 페이지로 이동 (이미 HTML에서 처리되어 있으면 중복 X)
}

// 게시글 상세 조회 페이지
function setupShowArticle() {
    // 상세 페이지용. 필요 시 구현 (네가 보여준 코드에는 상세 페이지 js는 없음)
}

// 게시글 삭제 기능
function setupDeleteArticle() {
    const deleteBtn = document.getElementById('deleteBtn');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', () => {
        const articleId = deleteBtn.dataset.articleId;
        const password = prompt("비밀번호를 입력하세요:");

        if (!password) {
            alert("비밀번호가 필요합니다.");
            return;
        }

        fetch(`/delete/${articleId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password})
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = '/articles'; // 삭제 후 리스트로
                } else {
                    alert(data.message || '삭제 실패');
                }
            })
            .catch(() => alert('서버 오류 발생'));
    });
}

// 게시글 수정 페이지 - 기존 글 불러오기 + 수정 요청
function setupUpdateArticle() {
    const updateBtn = document.getElementById('updateBtn');
    if (!updateBtn) return;

    const articleId = updateBtn.dataset.articleId;

    // 기존 글 불러오기
    fetch(`/update/${articleId}`)
        .then(res => {
            if (!res.ok) throw new Error('글을 불러올 수 없습니다.');
            return res.json();
        })
        .then(article => {
            document.getElementById('title').value = article.title;
            document.getElementById('content').value = article.content;
        })
        .catch(err => alert(err.message));

    updateBtn.addEventListener('click', () => {
        const password = prompt("비밀번호를 입력하세요:");
        if (!password) {
            alert("비밀번호가 필요합니다.");
            return;
        }

        const newTitle = document.getElementById('title').value.trim();
        const newContent = document.getElementById('content').value.trim();

        if (!newTitle || !newContent) {
            alert("제목과 내용을 모두 입력하세요.");
            return;
        }

        fetch(`/update/${articleId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password, title: newTitle, content: newContent})
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = `/article/${articleId}`; // 수정 후 상세 페이지로 이동
                } else {
                    alert(data.message || '수정 실패');
                }
            })
            .catch(() => alert('서버 오류 발생'));
    });
}

// 글 작성 페이지 - 저장, 취소 버튼 이벤트
function setupCreatePost() {
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    if (!saveBtn || !cancelBtn) return;

    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!title || !content || !password) {
            alert("제목, 내용, 비밀번호를 모두 입력하세요.");
            return;
        }

        fetch('/post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content, password})
        })
            .then(res => {
                if (res.redirected) {
                    window.location.href = res.url;
                } else {
                    alert('글 작성에 실패했습니다.');
                }
            })
            .catch(() => alert('서버 오류 발생'));
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/articles';
    });
}

// 페이지별로 알맞은 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    setupArticleList();
    setupDeleteArticle();
    setupUpdateArticle();
    setupCreatePost();
});
