type Theme = 'light' | 'dark';

class ThemeSwitcher extends HTMLElement {
    private themes: Theme[] = ['light', 'dark'];

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.initTheme();
        this.setupEventListeners();
    }

    private initTheme(): void {
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        let theme: Theme;
        if (!savedTheme || !this.themes.includes(savedTheme)) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        } else {
            theme = savedTheme;
        }

        this.setTheme(theme);
    }

    private setTheme(theme: Theme): void {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const checkbox = this.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        if (checkbox) {
            checkbox.checked = theme === 'light';
        }
    }

    private setupEventListeners(): void {
        const checkbox = this.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        if (checkbox) {
            checkbox.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const newTheme: Theme = target.checked ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        } else {
            throw new Error('Checkbox input not found in ThemeSwitcher component.');
        }
    }
}

customElements.define('theme-switcher', ThemeSwitcher);
