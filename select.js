class CustomSelect {
    constructor(selectElement) {
        this.select = selectElement;
        this.init();
    }

    init() {
        // Slėpti originalų select
        this.select.style.display = 'none';

        // Kurti wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select-wrapper';
        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);

        // Mygtuko elementas
        this.trigger = document.createElement('div');
        this.trigger.className = 'custom-select-trigger';
        this.wrapper.appendChild(this.trigger);

        // Parinkčių sąrašas
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'custom-select-options';
        this.wrapper.appendChild(this.optionsContainer);

        this.render();
        this.bindEvents();

        // Stebėti originalaus select pokyčius (pvz. kai JS įkelia grupių ar mokinių sąrašą)
        const observer = new MutationObserver(() => this.render());
        observer.observe(this.select, { childList: true, attributes: true });
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
            this.wrapper.style.opacity = '0.6';
            this.wrapper.style.pointerEvents = 'none';
        } else {
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
                this.select.dispatchEvent(new Event('change'));
                this.wrapper.classList.remove('open');
                this.render();
            });

            this.optionsContainer.appendChild(optionDiv);
        });
    }

    bindEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== this.wrapper) w.classList.remove('open');
            });
            this.wrapper.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.wrapper.classList.remove('open');
            }
        });
    }
}

function initCustomSelects() {
    document.querySelectorAll('select').forEach(select => {
        if (!select.classList.contains('custom-select-initialized')) {
            select.classList.add('custom-select-initialized');
            new CustomSelect(select);
        }
    });
}