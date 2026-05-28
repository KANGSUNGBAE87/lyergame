# 라이어 게임 (Liar Game)

진행자 없이 핸드폰 하나로 즐기는 라이어 게임. 모든 플레이어가 한 명씩 자기 카드를 눌러 단어(또는 라이어 표시)를 확인하면 게임 준비가 끝납니다.

## 게임 방법

1. **인원수 선택** (3 ~ 10명)
2. 화면에 인원수만큼 카드가 등장합니다.
3. 한 명씩 자기 카드를 한 번 터치하세요.
   - 약 2초간 카드가 공개됩니다.
   - 카드는 폭발 애니메이션과 함께 사라집니다.
4. 모든 카드가 사라지면 **"라이어가 정해졌습니다!"** 화면이 뜹니다.
5. 평소처럼 라이어 게임을 진행하세요.
6. 끝나면 **"다시 시작"** 버튼으로 인원 선택 화면으로 돌아갑니다.

## 카드 내용

- 일반 플레이어: `카테고리 / 단어` (예: `음식 / 김치`)
- 라이어: `라이어 / 카테고리: 음식` (단어는 모르고 카테고리만 압니다)

## 단어 데이터

- 20개 카테고리, 약 2,000개 단어
- 카테고리: 음식, 과일, 채소, 동물, 직업, 스포츠, 가전제품, 교통수단, 나라, 의류, 신체부위, 가구, 자연, 악기, 디저트, 음료, 곤충, 바다생물, 꽃, 학용품

## 실행 방법

### 로컬에서 바로 실행
`index.html` 파일을 더블클릭하면 브라우저에서 바로 실행됩니다.

### GitHub Pages 배포

저장소: <https://github.com/KANGSUNGBAE87/lyergame>

#### A. 웹에서 바로 업로드 (가장 쉬움)

1. 위 저장소 페이지로 이동
2. **Add file → Upload files** 클릭
3. `index.html`(과 원하면 `README.md`)을 드래그&드롭
4. **Commit changes** 클릭
5. **Settings → Pages**에서
   - Source: `Deploy from a branch`
   - Branch: `main` (또는 `master`), Folder: `/ (root)` 선택 후 **Save**
6. 1~2분 뒤 다음 주소에서 접속:
   - `https://kangsungbae87.github.io/lyergame/`

#### B. 로컬 git으로 푸시

```bash
git clone https://github.com/KANGSUNGBAE87/lyergame.git
cd lyergame
# 다운받은 index.html, README.md 를 이 폴더로 복사
git add .
git commit -m "Add liar game web app"
git push origin main
```

그 후 위 5번 단계의 GitHub Pages 활성화를 진행하면 같은 URL에서 접속할 수 있습니다.

## 기술 스펙

- 순수 HTML/CSS/JS (단일 파일, 외부 의존성 없음)
- 모바일 최적화 (세로 모드 권장)
- 오프라인 동작 가능 (단어 데이터 내장)
