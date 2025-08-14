export const Fonts = {
  // Poppins Font Family
  Poppins: {
    Thin: 'Poppins-Thin',
    ThinItalic: 'Poppins-ThinItalic',
    ExtraLight: 'Poppins-ExtraLight',
    ExtraLightItalic: 'Poppins-ExtraLightItalic',
    Light: 'Poppins-Light',
    LightItalic: 'Poppins-LightItalic',
    Regular: 'Poppins-Regular',
    Italic: 'Poppins-Italic',
    Medium: 'Poppins-Medium',
    MediumItalic: 'Poppins-MediumItalic',
    SemiBold: 'Poppins-Semibold',
    SemiBoldItalic: 'Poppins-SemiBoldItalic',
    Bold: 'Poppins-Bold',
    BoldItalic: 'Poppins-BoldItalic',
    ExtraBold: 'Poppins-ExtraBold',
    ExtraBoldItalic: 'Poppins-ExtraBoldItalic',
    Black: 'Poppins-Black',
    BlackItalic: 'Poppins-BlackItalic',
  },
} as const;

// Type for font weights
export type FontWeight = keyof typeof Fonts.Poppins;
export type FontFamily = typeof Fonts.Poppins[FontWeight]; 