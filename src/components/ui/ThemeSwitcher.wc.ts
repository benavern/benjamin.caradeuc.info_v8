import { LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

type Theme = 'light' | 'dark';

@customElement('theme-switcher')
export class ThemeSwitcher extends LitElement {
    private static STORAGE_KEY = 'theme';
    private themes: Theme[] = ['light', 'dark'];

    @query('input[type="checkbox"]')
    checkbox!: HTMLInputElement;

    @state()
    currentTheme?: Theme;

    // no shadow root
    createRenderRoot() {
        return this;
    }

    connectedCallback(): void {
        super.connectedCallback();

        const savedTheme = localStorage.getItem(ThemeSwitcher.STORAGE_KEY) as Theme | null;

        if (!savedTheme || !this.themes.includes(savedTheme)) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        } else {
            this.currentTheme = savedTheme;
        }
    }

    firstUpdated(): void {
        if (!this.checkbox) {
            throw new Error('[ThemeSwitcher] No checkbox found inside element on connect.');
        }

        this.checkbox.checked = this.currentTheme === 'light';
        this.synchroAriaAttributes();
        this.setupEventListeners();
    }

    private synchroAriaAttributes(): void {
        this.checkbox.ariaChecked = this.currentTheme === 'light' ? 'true' : 'false';
    }

    private handleCheckboxChange = (e: Event): void => {
        const target = e.target as HTMLInputElement;
        const newTheme: Theme = target.checked ? 'light' : 'dark';
        this.currentTheme = newTheme;
    };

    private setupEventListeners(): void {
        this.checkbox.addEventListener('change', this.handleCheckboxChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.checkbox?.removeEventListener('change', this.handleCheckboxChange);
    }

    updated(changedProps: Map<string, unknown>): void {
        if (changedProps.has('currentTheme')) {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem(ThemeSwitcher.STORAGE_KEY, this.currentTheme);
            this.synchroAriaAttributes();
        }
    }

    // Renders nothing as this component does not have a visual representation
    protected render(): void {}
}
