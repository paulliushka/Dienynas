// static/js/calendar.js

function initCalendar(inputId, showTime = false) {
    const dateInput = document.getElementById(inputId);
    if (!dateInput) return;

    // Create a container and insert it dynamically around the input field
    const container = document.createElement("div");
    container.className = "custom-datepicker-container";
    dateInput.parentNode.insertBefore(container, dateInput);
    container.appendChild(dateInput);

    const calendarBox = document.createElement("div");
    calendarBox.className = "custom-calendar";
    
    // HTML Structure of the calendar (Days and headers in Lithuanian)
    let calendarHTML = `
        <div class="calendar-header">
            <button type="button" class="calendar-btn cal-prev">&lt;</button>
            <span class="cal-month-year"></span>
            <button type="button" class="calendar-btn cal-next">&gt;</button>
        </div>
        <div class="calendar-weekdays">
            <div>Pr</div><div>An</div><div>Tr</div><div>Ket</div><div>Pn</div><div>Še</div><div>Se</div>
        </div>
        <div class="calendar-days"></div>
    `;

    // If the user requests time picker, append the time HTML block
    if (showTime) {
        calendarHTML += `
            <div class="calendar-time-picker">
                <span>Laikas:</span>
                <select class="cal-hours"></select>
                <span>:</span>
                <select class="cal-minutes"></select>
            </div>
        `;
    }

    calendarBox.innerHTML = calendarHTML;
    container.appendChild(calendarBox);

    // Selectors for this specific calendar instance
    const monthYearText = calendarBox.querySelector(".cal-month-year");
    const daysGrid = calendarBox.querySelector(".calendar-days");
    const prevBtn = calendarBox.querySelector(".cal-prev");
    const nextBtn = calendarBox.querySelector(".cal-next");

    // Month names in Lithuanian
    const months = [
        "Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis",
        "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
    ];

    let currentNavDate = new Date();
    let selectedDate = new Date();

    // Generate hours and minutes options if showTime is true
    if (showTime) {
        const hoursSelect = calendarBox.querySelector(".cal-hours");
        const minutesSelect = calendarBox.querySelector(".cal-minutes");

        for (let h = 0; h < 24; h++) {
            let hStr = h < 10 ? '0' + h : h;
            hoursSelect.innerHTML += `<option value="${hStr}">${hStr}</option>`;
        }
        for (let m = 0; m < 60; m += 5) {
            let mStr = m < 10 ? '0' + m : m;
            minutesSelect.innerHTML += `<option value="${mStr}">${mStr}</option>`;
        }

        // Set current local time by default
        let currentHour = new Date().getHours();
        let currentMinute = Math.round(new Date().getMinutes() / 5) * 5;
        if (currentMinute >= 60) currentMinute = 55;
        
        hoursSelect.value = currentHour < 10 ? '0' + currentHour : currentHour;
        minutesSelect.value = currentMinute < 10 ? '0' + currentMinute : currentMinute;

        hoursSelect.addEventListener("change", updateInputValue);
        minutesSelect.addEventListener("change", updateInputValue);
    }

    // Populate initial input field value
    setInitialDate();

    // Event Listeners
    dateInput.addEventListener("click", function (e) {
        e.stopPropagation();
        // Close any other open custom calendars on the page
        document.querySelectorAll(".custom-calendar").forEach(cal => {
            if (cal !== calendarBox) cal.classList.remove("active");
        });
        calendarBox.classList.toggle("active");
        renderCalendar();
    });

    document.addEventListener("click", function (e) {
        if (!calendarBox.contains(e.target) && e.target !== dateInput) {
            calendarBox.classList.remove("active");
        }
    });

    prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        currentNavDate.setMonth(currentNavDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        currentNavDate.setMonth(currentNavDate.getMonth() + 1);
        renderCalendar();
    });

    function renderCalendar() {
        daysGrid.innerHTML = "";
        const year = currentNavDate.getFullYear();
        const month = currentNavDate.getMonth();

        monthYearText.textContent = `${months[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        // Convert JS Sunday (0) to European Monday (1) standard layout
        let blankSpaces = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        for (let i = 0; i < blankSpaces; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.className = "calendar-day empty";
            daysGrid.appendChild(emptyDiv);
        }

        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.className = "calendar-day";
            dayDiv.textContent = day;

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add("today");
            }

            if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayDiv.classList.add("selected");
            }

            dayDiv.addEventListener("click", function (e) {
                e.stopPropagation();
                selectedDate = new Date(year, month, day);
                calendarBox.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("selected"));
                dayDiv.classList.add("selected");
                
                updateInputValue();
                calendarBox.classList.remove("active");
            });

            daysGrid.appendChild(dayDiv);
        }
    }

    function setInitialDate() {
        const yyyy = selectedDate.getFullYear();
        let mm = selectedDate.getMonth() + 1;
        let dd = selectedDate.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        if (showTime) {
            const hoursSelect = calendarBox.querySelector(".cal-hours");
            const minutesSelect = calendarBox.querySelector(".cal-minutes");
            dateInput.value = `${yyyy}-${mm}-${dd} ${hoursSelect.value}:${minutesSelect.value}`;
        } else {
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    function updateInputValue() {
        if (!selectedDate) return;
        const yyyy = selectedDate.getFullYear();
        let mm = selectedDate.getMonth() + 1;
        let dd = selectedDate.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        if (showTime) {
            const hoursSelect = calendarBox.querySelector(".cal-hours");
            const minutesSelect = calendarBox.querySelector(".cal-minutes");
            dateInput.value = `${yyyy}-${mm}-${dd} ${hoursSelect.value}:${minutesSelect.value}`;
        } else {
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }
}