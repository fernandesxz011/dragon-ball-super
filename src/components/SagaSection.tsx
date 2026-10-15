import type { CSSProperties } from 'react'
import type { Saga } from '../data/sagas'
import { useSceneMotion } from '../motion/useSceneMotion'

interface SagaSectionProps {
  saga: Saga
}

export function SagaSection({ saga }: SagaSectionProps) {
  const sceneRef = useSceneMotion('saga')
  const artDimensions = {
    '--scene-ratio': `${saga.artwork.width} / ${saga.artwork.height}`,
  } as CSSProperties

  return (
    <section
      ref={sceneRef}
      id={saga.id}
      className="saga-section"
      aria-labelledby={`${saga.id}-title`}
      data-saga={saga.id}
      data-scene={saga.id}
      style={artDimensions}
    >
      <div className="saga-section__edge" aria-hidden="true" data-scene-part="edge" />
      <div className="saga-section__art" data-scene-part="art">
        <picture>
          <img
            src={saga.artwork.desktop}
            srcSet={saga.artwork.srcSet}
            sizes="(max-width: 600px) 148vw, 100vw"
            width={saga.artwork.width}
            height={saga.artwork.height}
            alt={saga.artwork.alt}
            loading="lazy"
            decoding="async"
            data-protect-region={saga.artwork.protectedRegions}
          />
        </picture>
      </div>
      <div className="saga-section__content page-container">
        <header className="saga-section__heading" data-scene-part="heading">
          <span className="saga-section__number" aria-hidden="true" data-scene-part="number" data-reveal>
            {saga.number}
          </span>
          <div className="saga-section__title-group" data-reveal>
            {saga.editorialNote ? <p className="saga-section__note">{saga.editorialNote}</p> : null}
            <h3 id={`${saga.id}-title`} data-scene-part="title">{saga.name}</h3>
          </div>
        </header>
        <div className="saga-section__description" data-scene-part="description" data-reveal>
          <p className="saga-section__subtitle">{saga.title}</p>
          <p>{saga.description}</p>
        </div>
      </div>
    </section>
  )
}
