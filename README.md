# Chzzk_Timestamp_Marker
- 치치직 라이브 방송이나 다시보기를 시청하면서 편집점을 잡거나, 다시 보고 싶은 지점의 타임스탬프와 간단 설명을 저장합니다.

# 사용 화면
![화면 캡처 2025-03-18 204825](https://github.com/user-attachments/assets/26b22236-04b5-4f1f-bd00-b1349bbd62d7)

<br>

# 주요 기능

- 방송 / 다시보기를 보면서 원하는 지점의 타임스탬프와 간단한 설명을 기록합니다.
- 클립보드 복사 버튼을 눌러 기록한 마커 리스트를 복사합니다. 복사한 리스트는 메모장이나 유투브 댓글에 붙여넣어 사용하세요. <br> 다음과 같이 복사됩니다.
  ```
  00:35:59 마커 생성 테스트
  00:51:47 마커 생성 예시
  ```
- 단축키 'B'를 눌러 마커 생성 화면을 온오프 할 수 있습니다.
- 단축키 'C'를 눌러 채팅창 입력을 활성화합니다.

<br>

# 설치

아래 단계를 따라 UserScript를 설치하세요.

## STEP 1. ScriptManager
먼저 본인이 사용 중인 브라우저에 맞는 Tampermonkey 확장 프로그램을 설치하세요.
크롬을 권장합니다.

Chrome - [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ko&utm_source=ext_sidebar)

<br>

## STEP 2. UserScript
Tampermonkey 확장 프로그램 설치 후, 아래 링크를 클릭하세요. 팝업 창에서 "설치" 버튼을 눌러 스크립트를 설치합니다.

https://github.com/hiosDetaMachine/Chzzk_Timestamp_Marker/blob/main/Chzzk_Timestamp_Marker.js


> 주의: 본 스크립트를 설치 및 사용하며 발생하는 브라우저 과부하로 인한 응답 없음, 뻗음으로 인한 데이터 손실이나 기타 문제에 대해 개발자는 책임지지 않습니다(보고된 문제는 없음).
> 본 스크립트는 Tampermonkey 외의 스크립트 매니저에서는 정상 동작하지 않을 수 있습니다.

<br>

# 주의사항

- [빵떡](https://unripesoft.com/) 서비스처럼 시청자가 채팅으로 생성한 마커를 자동으로 수집하는 스크립트가 아닙니다. 개인이 메모하는 용도입니다.
- 마커는 사용 중인 브라우저의 로컬 저장소에 저장됩니다.
- 마커 리스트는 자동으로 초기화되지 않습니다. 사용이 끝난 후에는 리스트를 직접 초기화해야 합니다.
- 만약 마커를 기록하던 도중, 시청중인 방송을 변경하면 마커 기록이 섞일 수 있습니다. 각 방송마다 별도로 마커 리스트를 관리하는 기능은 추후에 제공될 예정입니다.
- 마커에 기록된 타임스탬프는 타이핑 속도에 따른 딜레이를 고려하여 자동으로 30초 전 시간으로 기록됩니다. <br> 만약 딜레이 시간을 조정하고 싶다면 스크립트에서 'delay' 변수의 값을 조정하세요.
```
// 이 코드를 찾아 숫자를 변경하세요
let delay = 0;
```
- 다시보기에서 마커를 기록하려면 단축키 'B'를 사용해야 마커 생성 창을 열 수 있습니다. 다시 닫을 때는 BackSpace나 ctrl + b를 눌러 닫아주세요.
- 스크립트 재배포, 2차 가공, 변형 모두 허용입니다.

<br>

# Virus Total 검사 기록

![image](https://github.com/user-attachments/assets/66fdb827-cbfd-4b7a-809b-717e7e72d3e3)

https://www.virustotal.com/gui/file/8eecc53f78fc36da9fc6f611d3d8c094dd2c4bf46b37a511f5a04db913e7b5c7?nocache=1

<br>

# 라이센스
MIT
