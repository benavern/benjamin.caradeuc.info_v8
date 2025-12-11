/**
 * Polyfill pour animation-timeline: view()
 * Simule les scroll-driven animations sur les navigateurs qui ne les supportent pas (Firefox)
 * Utilise IntersectionObserver pour déclencher les animations
 */

type AnimationState = {
    enterAnimation: string | null;
    leaveAnimation: string | null;
    isVisible: boolean;
    lastAnimationTime: number;
};

export class ScrollAnimationPolyfill {
    private animations: Map<Element, AnimationState> = new Map();
    private intersectionObserver: IntersectionObserver | null = null;
    private supportsAnimationTimeline: boolean;
    private animationDebounceMs = 100; // Éviter les animations trop fréquentes
    private mutationObserver: MutationObserver | null = null;

    constructor() {
        // Vérifier si le navigateur supporte nativement animation-timeline
        this.supportsAnimationTimeline = this.checkSupport();

        if (!this.supportsAnimationTimeline) {
            this.init();
            this.setupAstroTransitionListener();
        }
    }

    private checkSupport(): boolean {
        const el = document.createElement('div');
        const style = el.style as CSSStyleDeclaration & { animationTimeline?: string };
        return 'animationTimeline' in style;
    }

    private init(): void {
        // Observer pour détecter quand les éléments entrent/sortent de la vue
        // Utiliser 0.01 pour détecter dès que le premier pixel est visible
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const state = this.animations.get(entry.target);
                if (!state) return;

                if (entry.isIntersecting) {
                    // L'élément entre en vue -> animation d'entrée
                    this.playEnterAnimation(entry.target, state);
                } else {
                    // L'élément sort de la vue -> animation de sortie
                    this.playLeaveAnimation(entry.target, state);
                }
            });
        }, {
            threshold: 0.1, // Détecte dès que 1% de l'élément est visible
        });

        // Trouver tous les éléments avec scroll-animation
        this.scanElements();

        // Observer les mutations du DOM pour les éléments dynamiques
        this.mutationObserver = new MutationObserver(() => {
            this.scanElements();
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private scanElements(): void {
        const elements = document.querySelectorAll(
            '[scroll-animation], [scroll-animation-leave]'
        );

        elements.forEach((el) => {
            if (this.animations.has(el)) return;

            const enterAnimationName = el.getAttribute('scroll-animation');
            const leaveAnimationName = el.getAttribute('scroll-animation-leave');

            // Ne créer une entrée que si l'élément a au moins une animation
            if (enterAnimationName || leaveAnimationName) {
                const state: AnimationState = {
                    enterAnimation: enterAnimationName,
                    leaveAnimation: leaveAnimationName,
                    isVisible: false,
                    lastAnimationTime: 0,
                };
                this.animations.set(el, state);
                this.intersectionObserver?.observe(el);
            }
        });
    }

    private playEnterAnimation(element: Element, state: AnimationState): void {
        const el = element as HTMLElement;
        const now = Date.now();

        if (state.isVisible) return; // Déjà marqué comme visible

        // Débounce pour éviter les animations trop fréquentes
        if (now - state.lastAnimationTime < this.animationDebounceMs) {
            return;
        }

        state.isVisible = true;
        state.lastAnimationTime = now;

        if (state.enterAnimation) {
            // Réinitialiser et forcer l'animation
            el.style.animation = 'none';
            // Forcer un reflow pour que l'animation se relance
            void el.offsetWidth;
            el.style.animation = `${state.enterAnimation} 0.4s ease-out forwards`;
        }
    }

    private playLeaveAnimation(element: Element, state: AnimationState): void {
        const el = element as HTMLElement;
        const now = Date.now();

        if (!state.isVisible) return; // Déjà marqué comme invisible

        // Débounce pour éviter les animations trop fréquentes
        if (now - state.lastAnimationTime < this.animationDebounceMs) {
            return;
        }

        state.isVisible = false;
        state.lastAnimationTime = now;

        if (state.leaveAnimation) {
            // Réinitialiser et forcer l'animation
            el.style.animation = 'none';
            // Forcer un reflow pour que l'animation se relance
            void el.offsetWidth;
            el.style.animation = `${state.leaveAnimation} 0.4s ease-in forwards`;
        } else if (state.enterAnimation) {
            // Si pas d'animation de sortie, inverser l'animation d'entrée
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = `${state.enterAnimation} 0.4s ease-in reverse`;
        }
    }

    private setupAstroTransitionListener(): void {
        // Écouter les événements de transition d'Astro
        document.addEventListener('astro:before-swap', () => {
            // Réinitialiser avant la navigation
            this.animations.clear();
            this.intersectionObserver?.disconnect();
        });

        document.addEventListener('astro:after-swap', () => {
            // Réinitialiser après la navigation
            this.animations.clear();
            this.intersectionObserver?.disconnect();
            this.intersectionObserver = null;

            // Redémarrer le polyfill avec les nouveaux éléments
            this.init();
        });
    }

    public destroy(): void {
        this.intersectionObserver?.disconnect();
        this.animations.clear();
    }
}

// Initialiser le polyfill automatiquement
if (typeof window !== 'undefined') {
    // Utiliser un délai pour s'assurer que le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ScrollAnimationPolyfill();
        });
    } else {
        new ScrollAnimationPolyfill();
    }
}
