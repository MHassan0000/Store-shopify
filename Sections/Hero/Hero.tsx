import React from 'react'

type Props = {
  headline?: string
  description?: string
  image?: string
  primaryCtaText?: string
  primaryCtaHref?: string
}

const Hero: React.FC<Props> = ({ headline, description, image, primaryCtaText, primaryCtaHref }) => {
  return (
    <section className="hero">
      <div className="container">
        <h1>{headline}</h1>
        {description && <p>{description}</p>}
        {image && <img src={image} alt="Hero image" />}
        {primaryCtaText && (
          <a href={primaryCtaHref} className="btn-primary">
            {primaryCtaText}
          </a>
        )}
      </div>
      {/* ...existing styles or markup... */}
    </section>
  )
}

export default Hero
