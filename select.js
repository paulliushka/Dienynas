/* ==========================================================================
   CUSTOM SELECT KOMPONENTAS
   Pakeičia standartinį HTML <select> į pritaikytą dizainą ir palaiko
   automatinį sinchronizavimą su formos reset / kaita.
   ========================================================================== */

class CustomSelect {
    constructor(selectElement) {
        this.select = selectElement;
        this.init();
    }

    init() {
        // Slėpti originalų HTML select
        this.select.style.display = 'none';

        // Kurti pagrindinį wrapper konteinerį
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select-wrapper';
        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);

        // Sukurti matomą mygtuką/lauką
        this.trigger = document.createElement('div');
        this.trigger.className = 'custom-select-trigger';
        this.wrapper.appendChild(this.trigger);

        // Sukurti pasirinkimų sąrašo konteinerį
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'custom-select-options';
        this.wrapper.appendChild(this.optionsContainer);

        this.render();
        this.bindEvents();

        // Stebėti originalaus select vaikus (optgroup/option) ir neįgalumo būseną
        const observer = new MutationObserver(() => this.render());
        observer.observe(this.select, { childList: true, attributes: true, attributeFilter: ['disabled'] });

        // Stebėti formos reset įvykį, kad neliktų senų "ghost" reikšmių
        if (this.select.form) {
            this.select.form.addEventListener('reset', () => {
                setTimeout(() => this.render(), 0);
            });
        }
    }

    render() {
        this.optionsContainer.innerHTML = '';
        
        const selectedOption = this.select.options[this.select.selectedIndex] || this.select.options[0];
        const displayText = selectedOption ? selectedOption.textContent : '-- Pasirinkite --';
        
        this.trigger.innerHTML = `
            <span>${displayText}</span>
            <i class="custom-select-arrow"></i>
        `;

        if (this.select.disabled) {
            this.wrapper.classList.add('disabled');
            this.wrapper.style.opacity = '0.6';
            this.wrapper.style.pointerEvents = 'none';
        } else {
            this.wrapper.classList.remove('disabled');
            this.wrapper.style.opacity = '1';
            this.wrapper.style.pointerEvents = 'auto';
        }

        Array.from(this.select.options).forEach((opt, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-select-option';
            if (opt.disabled) optionDiv.classList.add('disabled');
            if (index === this.select.selectedIndex) optionDiv.classList.add('selected');
            
            optionDiv.textContent = opt.textContent;
            optionDiv.dataset.value = opt.value;

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                if (opt.disabled) return;

                this.select.selectedIndex = index;
                this.select.dispatchEvent(new Event('change', { bubbles: true }));
                this.wrapper.classList.remove('open');
                this.render();
            });

            this.optionsContainer.appendChild(optionDiv);
        });
    }

    bindEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.select.disabled) return;

            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== this.wrapper) w.classList.remove('open');
            });
            this.wrapper.classList.toggle('open');
        });

        // Uždaryti meniu paspaudus už jo ribų
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.wrapper.classList.remove('open');
            }
        });

        // Užfiksuoti programinius `change` įvykius
        this.select.addEventListener('change', () => this.render());
    }
}

// Inicializacijos funkcija visiems neaktyvuotiems select elementams
function initCustomSelects() {
    document.querySelectorAll('select').forEach(select => {
        if (!select.classList.contains('custom-select-initialized')) {
            select.classList.add('custom-select-initialized');
            new CustomSelect(select);
        }
    });
}