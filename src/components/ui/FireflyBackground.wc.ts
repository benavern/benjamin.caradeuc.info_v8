import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type Firefly = {
    el: HTMLDivElement;
    x: number;
    y: number;
    dx: number;
    dy: number;
    speed: number;
    phase: number;
};

@customElement('firefly-background')
export class FireflyBackground extends LitElement {
    @property({ type: Number })
    count = 9;

    private _fireflies: Firefly[] = [];
    private _animId: number | null = null;
    private _resizeObserver: ResizeObserver | null = null;

    static styles = css`
        :host {
            display: block;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: clip;
        }

        .firefly {
            position: absolute;
            width: min(60vw, 600px);
            height: min(60vw, 600px);
            border-radius: 50%;
            filter: blur(12px);
            opacity: 0.25;
            pointer-events: none;
            will-change: transform;
            background-image: radial-gradient(
                circle,
                var(--clr-primary) 0%,
                transparent 70%
            );
        }

        .firefly:nth-child(2n + 1) {
            background-image: radial-gradient(
                circle,
                var(--clr-accent) 0%,
                transparent 70%
            );
        }
    `;

    render() {
        return html`
            ${Array.from({ length: this.count }, () => html`<div class="firefly"></div>`)}
        `;
    }

    firstUpdated() {
        this._setupFireflies();

        this._resizeObserver = new ResizeObserver(() => {
            this._handleResize();
        });

        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this._animId) {
            cancelAnimationFrame(this._animId);
            this._animId = null;
        }

        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
    }

    private _setupFireflies() {
        const firefliesEls = this.shadowRoot?.querySelectorAll<HTMLDivElement>('.firefly');

        if (!firefliesEls?.length) return;

        this._fireflies = Array.from(firefliesEls).map(el => ({
            el,
            x: Math.random() * this.clientWidth,
            y: Math.random() * this.clientHeight,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            speed: 0.25 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2,
        }));

        this._animate();
    }

    private _handleResize() {
        for (const f of this._fireflies) {
            f.x = Math.random() * this.clientWidth;
            f.y = Math.random() * this.clientHeight;
        }
    }

    private _animate() {
        const time = Date.now();
        const width = this.clientWidth;
        const height = this.clientHeight;

        for (const f of this._fireflies) {
            f.x += f.dx * f.speed;
            f.y += f.dy * f.speed;

            if (f.x < 0 || f.x > width) f.dx = -f.dx;
            if (f.y < 0 || f.y > height) f.dy = -f.dy;

            f.dx += (Math.random() - 0.5) * 0.05;
            f.dy += (Math.random() - 0.5) * 0.05;

            const offsetX = Math.sin(time / 1000 + f.phase) * 10;
            const offsetY = Math.cos(time / 1200 + f.phase) * 10;

            f.el.style.transform = `translate(${f.x - f.el.offsetWidth / 2 + offsetX}px, ${f.y - f.el.offsetHeight / 2 + offsetY}px)`;
        }

        this._animId = requestAnimationFrame(() => this._animate());
    }
}
