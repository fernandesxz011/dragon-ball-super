import { assetUrl } from '../lib/asset-url'

export interface Saga {
  id: string
  number: string
  name: string
  title: string
  description: string
  editorialNote?: string
  artwork: {
    desktop: string
    srcSet: string
    width: number
    height: number
    alt: string
    protectedRegions: string
  }
}

// New cinematic masters and the original reference crops remain separate.
export const sagas: readonly Saga[] = [
  {
    id: 'moro',
    number: '01',
    name: 'Moro',
    title: 'Quando o universo prende a respiração.',
    description: 'Entre ruínas e energia azul, o primeiro confronto desta jornada ganha uma nova escala.',
    artwork: {
      desktop: assetUrl('assets/cinematic/moro-1672.jpg'),
      srcSet: `${assetUrl('assets/cinematic/moro-640.jpg')} 640w, ${assetUrl('assets/cinematic/moro-1120.jpg')} 1120w, ${assetUrl('assets/cinematic/moro-1672.jpg')} 1672w`,
      width: 1672,
      height: 940,
      alt: 'Moro em destaque, diante de uma paisagem azul de ruínas.',
      protectedRegions: '0.54,0,0.44,0.65',
    },
  },
  {
    id: 'granolah',
    number: '02',
    name: 'Granolah',
    title: 'Todo desejo deixa uma marca.',
    description: 'Um horizonte em âmbar. Um olhar que atravessa o silêncio. A jornada muda de direção.',
    artwork: {
      desktop: assetUrl('assets/cinematic/granolah-1672.jpg'),
      srcSet: `${assetUrl('assets/cinematic/granolah-640.jpg')} 640w, ${assetUrl('assets/cinematic/granolah-1120.jpg')} 1120w, ${assetUrl('assets/cinematic/granolah-1672.jpg')} 1672w`,
      width: 1672,
      height: 941,
      alt: 'Granolah em destaque, com ruínas ao pôr do sol ao fundo.',
      protectedRegions: '0.47,0.08,0.44,0.66',
    },
  },
  {
    id: 'super-hero',
    number: '03',
    name: 'Super Hero',
    title: 'O poder de ir além.',
    description: 'Violeta e dourado encontram heróis em destaque numa nova leitura visual.',
    artwork: {
      desktop: assetUrl('assets/cinematic/super-hero-1672.jpg'),
      srcSet: `${assetUrl('assets/cinematic/super-hero-640.jpg')} 640w, ${assetUrl('assets/cinematic/super-hero-1120.jpg')} 1120w, ${assetUrl('assets/cinematic/super-hero-1672.jpg')} 1672w`,
      width: 1672,
      height: 941,
      alt: 'Arte de fã: Gohan Beast com cabelo prateado e energia violeta diante de ruínas.',
      protectedRegions: '0.55,0,0.43,0.6',
    },
  },
  {
    id: 'black-freeza',
    number: '04',
    name: 'Black Freeza',
    title: 'O horizonte ainda não tem fim.',
    description: 'Uma visão de fã para o que pode existir depois do último confronto.',
    editorialNote: 'Conceito de fã',
    artwork: {
      desktop: assetUrl('assets/cinematic/black-freeza-1672.jpg'),
      srcSet: `${assetUrl('assets/cinematic/black-freeza-640.jpg')} 640w, ${assetUrl('assets/cinematic/black-freeza-1120.jpg')} 1120w, ${assetUrl('assets/cinematic/black-freeza-1672.jpg')} 1672w`,
      width: 1672,
      height: 940,
      alt: 'Black Freeza em destaque, cercado de energia violeta e rochas suspensas.',
      protectedRegions: '0.55,0.02,0.35,0.5;0.88,0.72,0.1,0.22',
    },
  },
]
