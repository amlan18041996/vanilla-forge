import sprite from './sprite.svg?raw';

const SPRITE_ID = 'vf-icon-sprite';

/**
 * Inject the SVG sprite into the document once.
 *
 * The sprite is inlined (rather than referenced as an external file) so that
 * `currentColor` works everywhere and there is no extra network request.
 * Call this once during app boot, before any `icon()` output is rendered.
 */
export function mountIconSprite() {
    if (typeof document === 'undefined' || document.getElementById(SPRITE_ID)) return;

    const template = document.createElement('template');
    template.innerHTML = sprite.trim();

    const spriteElement = template.content.firstElementChild;
    if (!spriteElement) return;

    spriteElement.id = SPRITE_ID;
    spriteElement.setAttribute('aria-hidden', 'true');
    spriteElement.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';

    (document.body || document.documentElement).prepend(spriteElement);
}

/**
 * Build an <svg> that references an icon from the sprite.
 *
 * @param {string} name - Icon name without the `icon-` prefix, e.g. "search".
 * @param {object} [options]
 * @param {string} [options.className] - Extra classes for the <svg> element.
 * @param {number|string} [options.size] - Optional width/height in CSS units.
 * @param {string} [options.label] - Accessible name. Omit for decorative icons.
 * @returns {string} SVG markup.
 */
export function icon(name, { className = '', size, label } = {}) {
    const classes = ['icon', className].filter(Boolean).join(' ');
    const resolvedSize = typeof size === 'number' ? `${size}px` : size;
    const dimensions = resolvedSize
        ? ` style="width:${resolvedSize};height:${resolvedSize}"`
        : '';
    const accessibility = label
        ? ` role="img" aria-label="${escapeAttribute(label)}"`
        : ' aria-hidden="true" focusable="false"';

    return `<svg class="${classes}"${dimensions}${accessibility}><use href="#icon-${name}"></use></svg>`;
}

function escapeAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
