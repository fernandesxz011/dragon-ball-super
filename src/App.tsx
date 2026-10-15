import { About } from './components/About'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SagaIndex } from './components/SagaIndex'
import { SagaSection } from './components/SagaSection'
import { sagas } from './data/sagas'
import { MotionProvider } from './motion/MotionProvider'
import { EnergyEffects } from './effects/EnergyEffects'

export default function App() {
  return (
    <MotionProvider>
      <EnergyEffects />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div id="inicio">
        <Header />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <section id="sagas" className="sagas" aria-labelledby="sagas-title">
            <SagaIndex />
            {sagas.map((saga) => <SagaSection key={saga.id} saga={saga} />)}
          </section>
          <About />
        </main>
        <Footer />
      </div>
    </MotionProvider>
  )
}
