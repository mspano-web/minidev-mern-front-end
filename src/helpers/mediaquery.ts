/**
 * mediaquery.ts - Values ​​used as a reference to establish the breakpoints of the responsive design.
 */

/* ------------------------------- */

  interface MQ {
     isDesktop: number,
     isTablet: number,
     isMobile: number
  }

  export const ScreenSize: MQ = { // in pixels
    isDesktop : 1200,
    isTablet : 768,
    isMobile : 320
  }

 
