import { ArrowIcon } from './ArrowIcon'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-container">
        <p>Projeto conceitual de fã. Sem afiliação oficial.</p>
        <a href="#inicio">Voltar ao início <ArrowIcon direction="up" /></a>
      </div>
    </footer>
  )
}
