import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";

const themes: Theme[] = ["light", "dark"];

function setTheme(theme: Theme | null) {
    if (!themes.includes(theme)) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        theme = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    return theme;
}

export default function ThemeSwitcher() {
    const [theme, setThemeState] = createSignal(null);
    const isLight = () => theme() === "light";

    function saveTheme(newTheme: Theme | null) {
        const savedTheme = setTheme(newTheme);
        setThemeState(savedTheme);
    }

    onMount(() => {
        saveTheme(localStorage.getItem("theme") as Theme | null);
    });

    const handleChange = (e: Event) => {
        const newTheme = (e.target as HTMLInputElement).checked ? "light" : "dark";
        saveTheme(newTheme);
    };

    return (
        <label class="theme-switcher">
            <span class="sr-only">
                Dark
            </span>
            🌚

            <input
                type="checkbox"
                role="switch"
                checked={isLight()}
                on:change={handleChange}
                aria-label="Changer le thème" />

            🌞
            <span class="sr-only">
                Light
            </span>
        </label>
    );
}
