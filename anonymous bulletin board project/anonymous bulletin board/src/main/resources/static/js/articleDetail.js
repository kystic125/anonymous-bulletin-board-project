document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;  // "/article/1"
    const articleId = path.split('/')[2];

    if (!articleId) {
        document.getElementById('article-title').textContent = "게시글 ID가 없습니다.";
        document.getElementById('article-content').textContent = "";
        return;
    }

    let currentData = null;  // 불러온 데이터 저장

    const titleEl = document.getElementById('article-title');
    const contentEl = document.getElementById('article-content');
    const pwInput = document.getElementById('password-input');
    const updateBtn = document.getElementById('update-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const listBtn = document.getElementById('list-btn');

    // 수정 모드용 요소들
    let titleInput, contentTextarea, saveBtn, cancelBtn;

    // 게시글 데이터 로드
    fetch(`/api/article/${articleId}`)
        .then(res => {
            if (!res.ok) throw new Error("게시글을 불러올 수 없습니다.");
            return res.json();
        })
        .then(data => {
            currentData = data;
            titleEl.textContent = data.title;
            contentEl.textContent = data.content;

            // 수정 버튼 클릭 이벤트 핸들러
            updateBtn.addEventListener('click', () => {
                const pw = pwInput.value;
                if (!pw) {
                    alert("비밀번호를 입력하세요.");
                    return;
                }

                // 비밀번호 검증 요청
                fetch(`/api/update/${articleId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: pw, title: data.title, content: data.content })
                })
                    .then(res => res.json())
                    .then(result => {
                        if(result.success) {
                            enterEditMode();
                        } else {
                            alert("비밀번호가 일치하지 않습니다.");
                        }
                    })
                    .catch(() => alert("서버 오류가 발생했습니다."));
            });

            // 삭제 버튼 이벤트
            deleteBtn.addEventListener('click', () => {
                const pw = pwInput.value;
                if (!pw) {
                    alert("비밀번호를 입력하세요.");
                    return;
                }
                fetch(`/api/delete/${articleId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: pw })
                })
                    .then(res => res.json())
                    .then(result => {
                        if(result.success) {
                            alert("삭제 완료");
                            window.location.href = '/articles';
                        } else {
                            alert("비밀번호가 일치하지 않습니다.");
                        }
                    })
                    .catch(() => alert("서버 오류가 발생했습니다."));
            });

            // 목록 버튼 이벤트
            listBtn.addEventListener('click', () => {
                window.location.href = '/articles';
            });
        })
        .catch(err => {
            titleEl.textContent = err.message;
            contentEl.textContent = "";
        });

    function enterEditMode() {
        // 기존 텍스트 감추기
        titleEl.style.display = 'none';
        contentEl.style.display = 'none';
        pwInput.parentNode.style.display = 'none'; // 비밀번호 입력칸 숨기기
        listBtn.style.display = 'none'; // 목록 버튼 숨기기
        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';

        // 수정용 input/textarea 생성 및 삽입
        titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = currentData.title;
        titleInput.style.width = '100%';
        titleInput.style.fontSize = '28px';
        titleInput.style.marginBottom = '10px';

        contentTextarea = document.createElement('textarea');
        contentTextarea.value = currentData.content;
        contentTextarea.style.width = '100%';
        contentTextarea.style.height = '200px';
        contentTextarea.style.fontSize = '16px';
        contentTextarea.style.lineHeight = '1.6';

        titleEl.parentNode.insertBefore(titleInput, titleEl);
        contentEl.parentNode.insertBefore(contentTextarea, contentEl);

        // 저장 버튼
        saveBtn = document.createElement('button');
        saveBtn.textContent = '수정 완료';
        saveBtn.style.backgroundColor = '#28a745'; // 초록색
        saveBtn.style.color = 'white';
        saveBtn.style.padding = '10px 20px';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '5px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.marginRight = '10px';

        // 취소 버튼
        cancelBtn = document.createElement('button');
        cancelBtn.textContent = '취소';
        cancelBtn.style.backgroundColor = '#6c757d'; // 회색
        cancelBtn.style.color = 'white';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '5px';
        cancelBtn.style.cursor = 'pointer';

        const btnGroup = document.querySelector('.button-row .left-buttons');
        btnGroup.appendChild(saveBtn);
        btnGroup.appendChild(cancelBtn);

        // 저장 버튼 클릭 이벤트
        saveBtn.addEventListener('click', () => {
            const updatedData = {
                title: titleInput.value,
                content: contentTextarea.value,
                password: pwInput.value // 원래 비밀번호 유지
            };

            fetch(`/api/update/${articleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
                .then(res => res.json())
                .then(result => {
                    if(result.success) {
                        alert("수정 완료");
                        exitEditMode(updatedData.title, updatedData.content);
                    } else {
                        alert("비밀번호가 일치하지 않습니다.");
                    }
                })
                .catch(() => alert("서버 오류가 발생했습니다."));
        });

        // 취소 버튼 클릭 이벤트
        cancelBtn.addEventListener('click', () => {
            exitEditMode(currentData.title, currentData.content);
        });
    }

    function exitEditMode(title, content) {
        // 수정용 input/textarea 제거
        titleInput.remove();
        contentTextarea.remove();

        // 저장, 취소 버튼 제거
        saveBtn.remove();
        cancelBtn.remove();

        // 기존 텍스트 다시 보여주기 및 내용 갱신
        titleEl.textContent = title;
        contentEl.textContent = content;
        titleEl.style.display = 'block';
        contentEl.style.display = 'block';

        // 비밀번호 입력칸 다시 보여주기
        pwInput.parentNode.style.display = 'flex';

        // 버튼 다시 보이기
        updateBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
        listBtn.style.display = 'inline-block';
    }
});
