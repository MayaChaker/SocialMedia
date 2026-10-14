/**
 * Runs before the first paint (inlined in the root layout). When the visitor has not asked
 * for reduced motion, it marks <html data-motion="on"> so CSS can hold [data-reveal] elements
 * hidden until their animation starts, instead of flashing them visible and then hiding them.
 *
 * If no animation has started three seconds later (a script failed to load), it switches
 * motion off so the content is shown anyway. MotionReady sets data-motion-ready on hydration.
 */
export const MOTION_GATE_SCRIPT = `(function(){var d=document.documentElement;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-motion","on");setTimeout(function(){if(!d.hasAttribute("data-motion-ready"))d.setAttribute("data-motion","off")},3000)})();`;
