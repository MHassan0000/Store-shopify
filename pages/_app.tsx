import { FC } from 'react'
import type { AppProps } from 'next/app'
import Layout from '@components/common/Layout'
import { builder, Builder } from '@builder.io/react'
import builderConfig from '@config/builder'
builder.init(builderConfig.apiKey)

import '@builder.io/widgets'
import '../blocks/ProductGrid/ProductGrid.builder'
import '../blocks/CollectionView/CollectionView.builder'
import '../blocks/ProductView/ProductView.builder'
import '../blocks/CloudinaryImage/CloudinaryImage.builder'
import '../Sections/Hero/Hero.builder'
import 'styles/tailwind.css';

import { InteractiveHoverButton } from "lib/components/magicui/interactive-hover-button";

Builder.register('insertMenu', {
  name: 'Shopify Collections Components',
  items: [
    { name: 'CollectionBox', label: 'Collection stuff' },
    { name: 'ProductCollectionGrid' },
    { name: 'CollectionView' },
  ],
})

Builder.register('insertMenu', {
  name: 'Shopify Products Components',
  items: [
    { name: 'ProductGrid' },
    { name: 'ProductBox' },
    { name: 'ProductView' },
  ],
})

Builder.register('insertMenu', {
  name: 'Cloudinary Components',
  items: [{ name: 'CloudinaryImage' }],
})

Builder.register('insertMenu', {
  name: 'Sections',
  items: [{ name: 'Hero', label: 'Hero' }],
})

const Noop: FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
)

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout pageProps={pageProps}>
      <Component {...pageProps} />
    </Layout>
  )
}
