/**
 * Polyfill pour CSS Anchor Positioning
 * Positionne les popovers par rapport à leurs ancres sur Firefox
 * Utilise Floating UI ou une logique simple de positionnement
 */

type AnchorConfig = {
    anchorElement: Element;
    targetElement: HTMLElement;
    anchorName: string;
    isOpen: boolean;
};

export class AnchorPositioningPolyfill {
    private anchors: Map<string, AnchorConfig> = new Map();
    private supportsAnchorPositioning: boolean;
    private resizeObserver: ResizeObserver | null = null;
    private intersectionObserver: IntersectionObserver | null = null;

    constructor() {
        this.supportsAnchorPositioning = this.checkSupport();

        if (!this.supportsAnchorPositioning) {
            this.init();
        }
    }

    private checkSupport(): boolean {
        const el = document.createElement('div');
        const style = el.style as CSSStyleDeclaration & { anchorName?: string };
        return 'anchorName' in style;
    }

    private init(): void {
        // Observer pour les changements de dimension/position
        this.resizeObserver = new ResizeObserver(() => {
            this.updateAllPositions();
        });

        // Observer pour la visibilité des éléments
        this.intersectionObserver = new IntersectionObserver(() => {
            this.updateAllPositions();
        });

        // Scanner les ancres
        this.scanAnchors();

        // Listener sur le scroll
        document.addEventListener('scroll', () => this.updateAllPositions(), { passive: true });
        window.addEventListener('resize', () => this.updateAllPositions());

        // Observer les mutations du DOM
        const mutationObserver = new MutationObserver(() => {
            this.scanAnchors();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Écouter les événements de transition d'Astro
        document.addEventListener('astro:after-swap', () => {
            this.anchors.clear();
            this.resizeObserver?.disconnect();
            this.intersectionObserver?.disconnect();
            this.scanAnchors();
        });
    }

    private scanAnchors(): void {
        // Stratégie: chercher les popovers qui ont un popover:open et un attribut id
        const popovers = document.querySelectorAll('[popover][id]');

        popovers.forEach((popover) => {
            // Chercher le bouton qui cible ce popover
            const buttonSelector = `[popovertarget="${popover.id}"]`;
            const button = document.querySelector(buttonSelector);

            if (button) {

                const config: AnchorConfig = {
                    anchorElement: button,
                    targetElement: popover as HTMLElement,
                    anchorName: popover.id,
                    isOpen: false,
                };

                this.anchors.set(popover.id, config);

                // Observer pour les changements de dimension
                this.resizeObserver?.observe(button);
                this.resizeObserver?.observe(popover);

                // Observer pour la visibilité
                this.intersectionObserver?.observe(button);
                this.intersectionObserver?.observe(popover);

                // Écouter les événements toggle du popover
                (popover as HTMLElement).addEventListener('toggle', (e: any) => {
                    config.isOpen = e.newState === 'open';

                    // Attendre que le popover soit rendu avant de le positionner
                    if (config.isOpen) {
                        // Utiliser requestAnimationFrame pour attendre que le popover soit peint
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                this.positionElement(config);
                            });
                        });
                    }
                });
            }
        });

        // Mettre à jour les positions initiales
        this.updateAllPositions();
    }

    private updateAllPositions(): void {
        this.anchors.forEach((config) => {
            this.positionElement(config);
        });
    }

    private positionElement(config: AnchorConfig): void {
        const { anchorElement, targetElement } = config;

        if (!config.isOpen) return;

        const anchorRect = anchorElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Récupérer les styles du popover
        const targetStyle = window.getComputedStyle(targetElement);
        const marginRight = parseFloat(targetStyle.marginInlineEnd) || 0;

        // Positionner à GAUCHE du bouton avec la marge
        let left = anchorRect.left - targetRect.width - marginRight;
        let top = anchorRect.top + anchorRect.height / 2 - targetRect.height / 2;

        // Ajuster si hors viewport
        if (left < 0) {
            // Positionner à droite du bouton
            left = anchorRect.right + marginRight;
        }

        if (top + targetRect.height > viewport.height) {
            top = viewport.height - targetRect.height - 10;
        }

        if (top < 0) {
            top = 10;
        }

        // Réinitialiser tous les styles de position
        targetElement.style.position = 'fixed';
        targetElement.style.inset = 'auto';
        targetElement.style.translate = 'none';
        targetElement.style.transform = 'none';

        // Appliquer la position
        targetElement.style.left = `${left}px`;
        targetElement.style.top = `${top}px`;
    }

    public destroy(): void {
        this.resizeObserver?.disconnect();
        this.intersectionObserver?.disconnect();
        this.anchors.clear();
    }
}

// Initialiser le polyfill automatiquement
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AnchorPositioningPolyfill();
        });
    } else {
        new AnchorPositioningPolyfill();
    }
}
