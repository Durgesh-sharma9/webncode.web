import html2canvas from 'html2canvas'

// Color converter using 2D canvas context
const dummyCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
const ctx2d = dummyCanvas ? dummyCanvas.getContext('2d') : null

/**
 * Normalizes modern CSS color functions (like oklch) into standard rgb/rgba hex strings
 * that html2canvas can safely parse.
 */
export function sanitizeColorValue(val: string): string {
  if (!val || typeof val !== 'string' || !val.includes('oklch')) {
    return val
  }
  return val.replace(/oklch\([^)]+\)/g, (match) => {
    try {
      if (ctx2d) {
        ctx2d.fillStyle = '#000000'
        ctx2d.fillStyle = match
        if (ctx2d.fillStyle && !ctx2d.fillStyle.includes('oklch')) {
          return ctx2d.fillStyle
        }
      }
    } catch {
      // Ignore context errors
    }
    return '#cbd5e1'
  })
}

function createProxyStyle(style: CSSStyleDeclaration): CSSStyleDeclaration {
  return new Proxy(style, {
    get(target, prop) {
      let val: any
      try {
        // Crucial: Use target[prop] (not Reflect.get with receiver) so native getters
        // on CSSStyleDeclaration.prototype execute with this === target, avoiding 'TypeError: Illegal invocation'
        val = (target as any)[prop]
      } catch {
        return undefined
      }

      // Enforce a tiny non-zero letterSpacing (0.01px) so html2canvas uses canvas
      // character measurement rather than collapsing spaces between words
      if (prop === 'letterSpacing') {
        if (!val || val === 'normal' || val === '0px' || val === '0') {
          return '0.01px'
        }
        return val
      }

      if (typeof val === 'function') {
        if (prop === 'getPropertyValue') {
          return (propertyName: string) => {
            try {
              if (propertyName === 'letter-spacing') {
                const rawLs = target.getPropertyValue('letter-spacing')
                if (!rawLs || rawLs === 'normal' || rawLs === '0px' || rawLs === '0') {
                  return '0.01px'
                }
                return rawLs
              }
              const raw = target.getPropertyValue(propertyName)
              return sanitizeColorValue(raw)
            } catch {
              return ''
            }
          }
        }
        return val.bind(target)
      }

      if (typeof val === 'string' && val.includes('oklch')) {
        return sanitizeColorValue(val)
      }

      return val
    }
  })
}

export async function safeHtml2Canvas(
  element: HTMLElement,
  userOptions: any = {}
): Promise<HTMLCanvasElement> {
  // 1. Wait for document fonts to be 100% loaded before capture
  try {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }
  } catch (e) {
    console.warn('Waiting for document.fonts.ready failed:', e)
  }

  const originalGetComputedStyle = window.getComputedStyle

  try {
    // 2. Intercept window.getComputedStyle on current document
    window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
      const style = originalGetComputedStyle.call(window, elt, pseudoElt)
      return createProxyStyle(style)
    }

    const mergedOptions = {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      ...userOptions,
      onclone: async (clonedDoc: Document, clonedElement: HTMLElement) => {
        // Intercept getComputedStyle in the cloned iframe's window
        if (clonedDoc.defaultView) {
          const originalClonedGCS = clonedDoc.defaultView.getComputedStyle
          clonedDoc.defaultView.getComputedStyle = function (
            elt: Element,
            pseudoElt?: string | null
          ) {
            const style = originalClonedGCS.call(clonedDoc.defaultView, elt, pseudoElt)
            return createProxyStyle(style)
          }
        }

        // Wait for iframe fonts if supported
        try {
          if (clonedDoc.fonts && clonedDoc.fonts.ready) {
            await clonedDoc.fonts.ready
          }
        } catch {}

        // Inject global override to eliminate Tailwind v4 preflight oklch border defaults
        // and ensure letter-spacing is non-zero so words retain natural spaces
        try {
          const styleEl = clonedDoc.createElement('style')
          styleEl.textContent = `
            *, *::before, *::after {
              border-color: #cbd5e1 !important;
              outline-color: #cbd5e1 !important;
              text-decoration-color: currentColor !important;
              letter-spacing: 0.01px;
            }
          `
          clonedDoc.head.appendChild(styleEl)
        } catch (e) {
          console.warn('Failed to inject style tag into clonedDoc:', e)
        }

        if (userOptions.onclone) {
          await userOptions.onclone(clonedDoc, clonedElement)
        }
      }
    }

    return await html2canvas(element, mergedOptions)
  } finally {
    // Always restore original window.getComputedStyle
    window.getComputedStyle = originalGetComputedStyle
  }
}
