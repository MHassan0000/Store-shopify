import dynamic from 'next/dynamic'
import { Builder } from '@builder.io/react'


const LazyHero = dynamic(async () => { 
  const mod = await import('./Hero')
  return (mod as any).default
})

Builder.registerComponent(LazyHero, {
  name: 'Hero',
  inputs: [
    {
      name: 'headline',
      type: 'string',
      defaultValue: 'The simplest way to build Ecommerce sites with Next.js',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'image',
      type: 'file',
      allowedFileTypes: ['png', 'jpg', 'jpeg', 'svg', 'gif'],
    },
    {
      name: 'primaryCtaText',
      type: 'string',
      defaultValue: 'Shop now',
    },
    {
      name: 'primaryCtaHref',
      type: 'string',
      defaultValue: '/',
    },
  ],
})
// Log to help debugging registration in the browser console
try {
  // eslint-disable-next-line no-console
  console.log('[Builder] Registered component: Hero')
} catch (e) {
  // ignore server-side console issues
}
