import { sagas } from '../data/sagas'
import { ArrowIcon } from './ArrowIcon'

export function SagaIndex() {
  return (
    <div className="saga-index page-container">
      <div className="saga-index__intro">
        <h2 id="sagas-title">Sagas</h2>
        <p>Quatro visões. Uma jornada.</p>
      </div>
      <nav aria-label="Explorar as sagas">
        <ol className="saga-index__links">
          {sagas.map((saga) => (
            <li key={saga.id} data-saga={saga.id}>
              <a href={`#${saga.id}`}>
                <span className="saga-index__number" aria-hidden="true">{saga.number}</span>
                <span>{saga.name}</span>
                <ArrowIcon />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
