// ==UserScript==
// @name         Chzzk Timestamp Marker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  치치직 라이브 방송이나 다시보기를 보면서 편집점이나 다시보고 싶은 지점에 타임스탬프와 간단 설명을 저장합니다.
// @author       hiosDetaMachine
// @match        https://chzzk.naver.com/live*
// @match        https://*.chzzk.naver.com/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let markers = JSON.parse(localStorage.getItem('chzzk_markers') || '[]');
    let container;
    let isVisible = false;
    let delay = 0;

    function createUI() {

        // 타임스탬프 관리 화면
        container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            bottom: '100px',
            right: '13px',
            backgroundColor: 'white',
            color: 'black',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '10000',
            display: 'flex',
            flexDirection: 'column',
            width: '313px',
            fontSize: '14px',
            textAlign: 'center',
            visibility: 'hidden',
            border: '1px solid black',
        });

        // 타임스탬프 내용 입력 창
        let input = document.createElement('input');
        Object.assign(input.style, {
            marginBottom: '5px',
            padding: '5px',
            fontSize: '14px',
            width: '90%',
            alignSelf: 'center'
        });
        input.type = 'text';
        input.placeholder = '메시지 입력';

        // 입력한 내용을 로컬 호스트에 저장하는 버튼
        let button = document.createElement('button');
        button.innerText = '마커 추가 (Enter)';
        Object.assign(button.style, {
            padding: '5px',
            cursor: 'pointer',
            marginTop: '5px',
            backgroundColor: '#ff4757',
            color: 'black',
            border: 'none',
            borderRadius: '3px'
        });

        // 가장 마지막에 입력한 타임스탬프의 내용을 표시
        let markerList = document.createElement('div');
        Object.assign(markerList.style, {
            marginTop: '10px',
            maxHeight: '150px',
            overflowY: 'auto',
            fontSize: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '5px',
            borderRadius: '3px'
        });


        // 기록한 타임스탬프 리스트를 복사하는 버튼
        let copyButton = document.createElement('button');
        copyButton.innerText = '클립보드 복사';
        Object.assign(copyButton.style, {
            padding: '5px',
            cursor: 'pointer',
            backgroundColor: '#1e90ff',
            color: 'black',
            border: 'none',
            borderRadius: '3px'
        });


        // 기록한 타임스탬프 리스트를 초기화하는 버튼
        let clearButton = document.createElement('button');
        clearButton.innerText = '초기화';
        Object.assign(clearButton.style, {
            padding: '5px',
            cursor: 'pointer',
            backgroundColor: '#81c147',
            color: 'black',
            border: 'none',
            borderRadius: '3px'
        });

        // 마커 생성 창 닫는 버튼
        let closeButton = document.createElement('button');
        closeButton.innerText = '창 닫기 (Backspace)';
        Object.assign(closeButton.style, {
            padding: '5px',
            cursor: 'pointer',
            backgroundColor: '#f89b00',
            color: 'black',
            border: 'none',
            borderRadius: '3px'
        });

        const buttonClasses = [
            "button_container__ppWwB",
            "button_primary__b63Y7",
            "button_solid__ZZe8g",
            "button_smaller__98NMU"
            //"button_font_bold__qEQfU"
        ];
        
        [button, copyButton, clearButton, closeButton].forEach(buttonElement => {
            buttonElement.classList.add(...buttonClasses);
        });       

        // 타임스탬프 저장 버튼
        button.onclick = function () {
            addMarker(input.value.trim());
        };

        // 복사 버튼
        copyButton.onclick = function () {
            navigator.clipboard.writeText(markers.join('\n')).then(() => {
                let message = document.createElement('div');
                message.innerText = '마커 리스트가 클립보드에 복사되었습니다!';
                Object.assign(message.style, {
                    position: 'absolute',
                    bottom: '120px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    zIndex: '10001',
                });
                document.body.appendChild(message);
                setTimeout(() => document.body.removeChild(message), 2000);
            });
        };

        // 타임스탬프 리스트 초기화
        clearButton.onclick = function () {
            markers = [];
            saveMarkers();
            updateMarkerList();
            input.value = '';
        };

        // 마커 생성 창 닫기
        closeButton.onclick = function () {
            input.value = '';
            event.preventDefault(); // 기본 동작 방지 (필요 시)
            toggleUI();
        };

        // 버튼을 담을 div를 생성하고, 가로로 배치
        let buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'space-between', // 버튼들 사이에 간격을 두기
            width: '100%', // 버튼들이 컨테이너의 전체 너비를 사용하게 하기
            marginTop: '10px',
        });

        buttonContainer.appendChild(clearButton);
        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(copyButton);
        buttonContainer.style.order = "10";

        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(markerList);
        container.appendChild(buttonContainer); // 버튼 컨테이너 추가

        document.body.appendChild(container);

        if (document.querySelector('.live_chatting_input_area__O9qXY')) {
            moveToChatInput();
        }

        updateMarkerList();


        //엔터키를 누르면 '마커 추가' 기능이 동작
        input.addEventListener('keydown', function (event) {
            if (input.value != '' && event.key === 'Enter') {
                event.preventDefault();
                addMarker(input.value.trim());
                input.value = '';
            }
        });

        //백스페이스를 누르면 'toggleUI()' 기능이 동작
        input.addEventListener('keydown', function (event) {
            if (input.value === '' && event.key === 'Backspace') {
                event.preventDefault(); // 기본 동작 방지 (필요 시)
                toggleUI();
            }
        });

    }

    // 타임스탬프 기록 함수
    function addMarker(message) {
        if (message) {
            let time = getBroadcastTime();
            if (time) {
                markers.push(`${time} ${message}`);
                saveMarkers();
                updateMarkerList();
            }
        }
    }

    function moveToChatInput() {
        let observer = new MutationObserver(() => {
            let chatInputArea = document.querySelector('.live_chatting_input_area__O9qXY');
            if (chatInputArea && chatInputArea.parentNode) {
                chatInputArea.parentNode.insertBefore(container, chatInputArea);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 방송 진행 시간에서 delay초만큼 뺀 값을 반환하는 함수
    function getBroadcastTime() {

        // 다시보기에서 마커를 생성할 경우
        let currentTimeElement = document.querySelector('span.pzp-vod-time__current-time');
        if (currentTimeElement) {
            return calDelay(currentTimeElement);
        }

        //실시간 라이브에서 마커를 생성하는 경우
        let timeElement = document.querySelector('span.video_information_count__Y05sI');
        if (timeElement) {
            return calDelay(timeElement);
        }

        return null;
    }

    // HH:MM:SS 형식의 타임스탬프를 초로 변환한다음, delay 초만큼 빼고 다시 HH:MM:SS 형식으로 반환
    function calDelay(timeElement) {
        let timeString = timeElement.textContent.split(' ')[0];
        let [hours, minutes, seconds] = timeString.split(':').map(num => parseInt(num));
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - delay;

        if (totalSeconds < 0) totalSeconds = 0; // 0초 미만으로는 안 되므로 0으로 설정

        let newHours = Math.floor(totalSeconds / 3600);
        let newMinutes = Math.floor((totalSeconds % 3600) / 60);
        let newSeconds = totalSeconds % 60;

        newHours = newHours.toString().padStart(2, '0');
        newMinutes = newMinutes.toString().padStart(2, '0');
        newSeconds = newSeconds.toString().padStart(2, '0');

        return `${newHours}:${newMinutes}:${newSeconds}`;
    }


    function getNameText() {
        let nameElement = document.querySelector('span.name_text__yQG50'); // 요소 찾기
        if (nameElement) {
            return nameElement.textContent.trim(); // 텍스트 가져오기
        }
        return null; // 요소가 없으면 null 반환
    }

    // 가장 마지막으로 생성한 마커를 표시하는 함수
    function updateMarkerList() {
        if (!container) return;
        let markerList = container.querySelector('div:nth-child(3)');
        if (markerList) {
            markerList.innerHTML = '';

            markers.slice(-1).forEach(marker => {
                let p = document.createElement('p');
                p.innerText = marker;
                markerList.appendChild(p);
            });
            /*
            markers.forEach(marker => {
                let p = document.createElement('p');
                p.innerText = marker;
                markerList.appendChild(p);
            });
            */
        }
    }

    // 기록한 타임스탬프를 크롬의 로컬저장소에 json 형식으로 기록하는 함수
    function saveMarkers() {
        localStorage.setItem('chzzk_markers', JSON.stringify(markers));
    }


    // '마커'버튼을 누르면 마커 기록 화면을 온오프함
    // 단축키는 'B'
    function toggleUI() {
        if (!container) return;
        isVisible = !isVisible;
        container.style.visibility = isVisible ? 'visible' : 'hidden';

        if (isVisible) {
            let input = container.querySelector('input');
            if (input) {
                input.focus();
            }
        }
    }

    // 마커 화면을 온오프하는 버튼 생성
    function createToggleButton() {
        if (document.getElementById('markerToggleButton')) return;

        let toggleButton = document.createElement('button');
        toggleButton.id = 'markerToggleButton';
        toggleButton.innerText = '마커 (B)';

        Object.assign(toggleButton.style, {
            padding: '0px 10px',
            fontSize: '13px',
            backgroundColor: '#f0f1f2',
            color: 'black',
            //border: '1px solid black',
            borderRadius: '8px',
            cursor: 'pointer',
            marginLeft: '5px'
        });

        // 네이버 채팅 버튼과 동일한 스타일 적용
        toggleButton.classList.add(
            "button_container__ppWwB",
            "button_primary__b63Y7",
            "button_solid__ZZe8g",
            "button_smaller__98NMU",
            "button_font_bold__qEQfU"
        );

        toggleButton.addEventListener('click', toggleUI);

        let observer = new MutationObserver(() => {
            let chatTools = document.querySelector('.live_chatting_input_tools__OPA1R');
            let sendChatButton = document.getElementById('send_chat_or_donate'); // "채팅" 버튼

            if (chatTools && sendChatButton && !chatTools.contains(toggleButton)) {
                chatTools.insertBefore(toggleButton, sendChatButton); // "채팅" 버튼 왼쪽에 추가
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    //마커창 온오프 단축키
    document.addEventListener('keydown', event => {
        if (event.key === 'b') {
            event.preventDefault(); // 단축키 사용 중 입력을 방지
            toggleUI();
        }

    });

    // C키를 누르면 채팅창으로 커셔를 이동(포커스)함
    function inputFocus() {
        let input = document.querySelector('textarea.live_chatting_input_input__2F3Et');
        if (input) {
            input.focus();
        }
    }

    // 채팅창 입력 활성화 단축키
    document.addEventListener('keydown', event => {
        if (event.key === 'c') { // 소문자로 비교
            inputFocus();
        }
    });

    window.addEventListener('load', () => {
        createUI();
        createToggleButton();

    });
})();
