
const API = {
    course: "https://cors-anywhere.herokuapp.com/http://109.73.207.225:8080/api/course/",
    sendMessage: "https://cors-anywhere.herokuapp.com/http://109.73.207.225:8080/api/message/"
};

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");
const chatId = params.get("chatId");

loadCourse(courseId);

function loadCourse(courseId) {
    fetch(API.course + courseId)
        .then(res => res.json())
        .then(course => {
            document.getElementById("courseTitle").textContent = course.title;
            document.getElementById("courseDescription").textContent = course.description;

            renderLessons(course.lessons);
        });
}

function renderLessons(lessons) {
    const container = document.getElementById("lessonsContainer");
    container.innerHTML = "";

    lessons
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .forEach(lesson => {
            const card = document.createElement("div");
            card.className = "lesson-card";

            let html = `
                <h4 class="lesson-title">${lesson.title}</h4>
                <p class="lesson-description">${lesson.description}</p>
            `;

            if (lesson.messageIds && lesson.messageIds.length > 0) {
                lesson.messageIds.forEach((messageId, index) => {
                    const displayNumber = index + 1;
                    html += `
                        <button
                            class="btn btn-sm message-button"
                            onclick="sendMessage(${messageId}, this)"
                        >
                            Сообщение ${displayNumber}
                        </button>`;
                });
            }

            card.innerHTML = html;
            container.appendChild(card);
        });
}

function sendMessage(messageId, button) {
    button.disabled = true;

    fetch(API.sendMessage + messageId + "?chatId=" + chatId, { method: "POST" },)
        .then(res => {
            if (res.ok) {
                window.location.href = `https://t.me/WhiskeyCodeHelpContentBot`;
            } else {
                alert("Ошибка при отправке сообщения");
                button.disabled = false;
            }
        })
        .catch(() => {
            alert("Ошибка соединения с сервером");
            button.disabled = false;
        });
}
