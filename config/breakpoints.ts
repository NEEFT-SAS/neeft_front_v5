/**
 * Breakpoints standardisés pour le projet (en pixels)
 * Utilisez les custom media queries dans vos @media CSS : @media (--breakpoint-md) { ... }
 */
export const breakpoints = {
  xs: '320px',   // très petits écrans
  sm: '352px',   // petits mobiles
  md: '672px',   // tablettes
  lg: '1152px',  // desktop
  xl: '1536px',  // grands écrans
  '2xl': '1920px', // très grands écrans
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Custom media queries disponibles (définies dans main.scss) :
 * --breakpoint-xs, --breakpoint-sm, --breakpoint-md, --breakpoint-lg, --breakpoint-xl, --breakpoint-2xl
 * --breakpoint-below-sm, --breakpoint-below-md, --breakpoint-below-lg
 * 
 * Exemple d'utilisation :
 * @media (--breakpoint-md) { ... }
 * @media (--breakpoint-below-sm) { ... }
 */
