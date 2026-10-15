import { ArrowIcon } from './ArrowIcon'
import { useSceneMotion } from '../motion/useSceneMotion'
import { DragonBallFallback } from '../effects/DragonBallFallback'
import { assetUrl } from '../lib/asset-url'

export function Hero() {
  const sceneRef = useSceneMotion('intro')
  return (
    <section ref={sceneRef} className="hero" aria-labelledby="page-title" data-scene="intro">
      <div className="hero__media" data-scene-part="art">
        <img
          className="hero__image"
          src={assetUrl('assets/cinematic/hero-1672.jpg')}
          srcSet={`${assetUrl('assets/cinematic/hero-640.jpg')} 640w, ${assetUrl('assets/cinematic/hero-1120.jpg')} 1120w, ${assetUrl('assets/cinematic/hero-1672.jpg')} 1672w`}
          sizes="(max-width: 600px) 178vw, 100vw"
          width={1672}
          height={941}
          alt="Arte de fã: Goku com cabelo prateado e Vegeta entre ruínas cósmicas e energia azul e violeta."
          data-protect-region="0.46,0,0.54,0.82"
          fetchPriority="high"
        />
      </div>
      <div className="hero__caption page-container" data-scene-part="caption">
        <h1 id="page-title" data-reveal>
          <span>Além do</span>{' '}
          <span className="hero__title-future">limite.</span>
        </h1>
        <p className="hero__description" data-reveal>Uma jornada visual pelas sagas e pelo futuro que imaginamos.</p>
        <div className="hero__actions">
          <div className="hero__action-copy">
            <a className="explore-link" href="#moro" data-reveal>
              Explorar sagas <ArrowIcon direction="down-right" />
            </a>
            <p data-reveal>Projeto conceitual de fã.</p>
          </div>
          <div className="hero__sphere-slot" aria-hidden="true">
            <DragonBallFallback />
          </div>
        </div>
      </div>
    </section>
  )
}
