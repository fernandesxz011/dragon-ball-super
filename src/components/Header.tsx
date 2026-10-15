export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-container">
        <a className="brand" href="#inicio" aria-label="Dragon Ball Super — Início">
          Dragon Ball <span>Super</span>
        </a>
        <nav className="primary-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#sagas">Sagas</a>
          <a href="#sobre">Sobre o projeto</a>
        </nav>
      </div>
    </header>
  )
}
