// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'AlibabaPuHuiTi-2',
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: [
    { 'grid-center': 'grid place-items-center' },
  ],
  rules: [],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
