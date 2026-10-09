class CustomCalendarPicker {
    constructor(inputElement) {
        this.input = inputElement;

        // Pakeičiame tipą į text, kad iOS/Android neatidarytų natūralaus kalendoriaus
        this.input.type = 'text';
        this.input.readOnly = true;
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('inputmode', 'none');
        
        this.input.classList.add('custom-calendar-input');

        this.today = new Date();
        
        if (this.input.value) {
            const parts = this.input.value.split('-');
            if (parts.length === 3) {
                this.selectedYear = parseInt(parts[0], 10);
                this.selectedMonth = parseInt(parts[1], 10) - 1;
                this.selectedDay = parseInt(parts[2], 10);
            }
        }

        this.currentMonth = this.selectedMonth !== undefined ? this.selectedMonth : this.today.getMonth();
        this.currentYear = this.selectedYear !== undefined ? this.selectedYear : this.today.getFullYear();

        this.init();
    }

    init() {
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-calendar-wrapper';
        this.input.parentNode.insertBefore(wrapper, this.input);
        wrapper.appendChild(this.input);

        this.popup = document.createElement('div');
        this.popup.className = 'custom-calendar-popup';
        wrapper.appendChild(this.popup);

        this.render();

        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-calendar-popup').forEach(p => {
                if (p !== this.popup) p.classList.remove('show');
            });
            this.popup.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                this.popup.classList.remove('show');
            }
        });
    }

    render() {
        const monthsLT = [
            'Sausis', 'Vasaris', 'Kovas', 'Balandis', 
            'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 
            'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
        ];

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

        let startingDay = firstDay.getDay() - 1;
        if (startingDay === -1) startingDay = 6;

        let html = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav-btn" id="prevMonth">&lt;</button>
                <span class="calendar-title">${monthsLT[this.currentMonth]} ${this.currentYear}</span>
                <button type="button" class="calendar-nav-btn" id="nextMonth">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-head">Pr</div>
                <div class="calendar-day-head">An</div>
                <div class="calendar-day-head">Tr</div>
                <div class="calendar-day-head">Ket</div>
                <div class="calendar-day-head">Pen</div>
                <div class="calendar-day-head">Še</div>
                <div class="calendar-day-head">Sek</div>
        `;

        for (let i = 0; i < startingDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const formattedMonth = String(this.currentMonth + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateStr = `${this.currentYear}-${formattedMonth}-${formattedDay}`;

            const isSelected = this.input.value === dateStr ? 'selected' : '';
            const isToday = (
                day === this.today.getDate() && 
                this.currentMonth === this.today.getMonth() && 
                this.currentYear === this.today.getFullYear()
            ) ? 'today' : '';

            html += `<div class="calendar-day ${isSelected} ${isToday}" data-date="${dateStr}">${day}</div>`;
        }

        html += `</div>`;
        this.popup.innerHTML = html;

        this.popup.querySelector('#prevMonth').onclick = (e) => {
            e.stopPropagation();
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.render();
        };

        this.popup.querySelector('#nextMonth').onclick = (e) => {
            e.stopPropagation();
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.render();
        };

        this.popup.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.onclick = (e) => {
                e.stopPropagation();
                this.input.value = dayEl.dataset.date;
                this.popup.classList.remove('show');
                this.input.dispatchEvent(new Event('change'));
                this.render();
            };
        });
    }
}

function initCalendarPickers() {
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.classList.contains('custom-calendar-initialized')) {
            input.classList.add('custom-calendar-initialized');
            new CustomCalendarPicker(input);
        }
    });
}