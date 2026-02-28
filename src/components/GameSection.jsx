import { useMemo, useState } from 'react'
import './GameSection.css'

const options = [
  { value: 'piatra', label: 'Piatră', emoji: '🪨' },
  { value: 'foarfeca', label: 'Foarfecă', emoji: '✂️' },
  { value: 'hartie', label: 'Hârtie', emoji: '📄' },
]

const winMap = {
  piatra: 'foarfeca',
  foarfeca: 'hartie',
  hartie: 'piatra',
}

const GameSection = () => {
  const [p1, setP1] = useState('piatra')
  const [p2, setP2] = useState('foarfeca')
  const [history, setHistory] = useState([])

  const score = useMemo(
    () =>
      history.reduce(
        (acc, round) => {
          if (round.winner === 'P1') acc.p1 += 1
          if (round.winner === 'P2') acc.p2 += 1
          if (round.winner === 'E') acc.draws += 1
          return acc
        },
        { p1: 0, p2: 0, draws: 0 },
      ),
    [history],
  )

  const currentResult = useMemo(() => {
    if (!history.length) {
      return {
        winner: null,
        message: 'Alege mutările și apasă „Joacă rundă” pentru un duel epic!',
      }
    }

    const latest = history[0]
    if (latest.winner === 'E') {
      return { winner: 'E', message: 'Egalitate perfectă. Sunteți la fel de buni! ⚡' }
    }

    return {
      winner: latest.winner,
      message:
        latest.winner === 'P1'
          ? 'Player 1 domină arena! 🔥'
          : 'Player 2 a preluat controlul! 🚀',
    }
  }, [history])

  const determineWinner = (firstMove, secondMove) => {
    if (firstMove === secondMove) return 'E'
    return winMap[firstMove] === secondMove ? 'P1' : 'P2'
  }

  const playRound = (event) => {
    event.preventDefault()

    const winner = determineWinner(p1, p2)
    const newRound = {
      id: crypto.randomUUID(),
      p1,
      p2,
      winner,
      timestamp: new Date().toLocaleTimeString('ro-RO'),
    }

    setHistory((prev) => [newRound, ...prev].slice(0, 8))
  }

  const resetGame = () => {
    setHistory([])
    setP1('piatra')
    setP2('foarfeca')
  }

  return (
    <section className="game-card">
      <header>
        <h1>Piatră • Foarfecă • Hârtie</h1>
        <p>Cel mai șmecher duel: scor live, istoric de runde și vibe de campionat.</p>
      </header>

      <form className="move-grid" onSubmit={playRound}>
        <label>
          <span>Player 1</span>
          <select value={p1} onChange={(event) => setP1(event.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Player 2</span>
          <select value={p2} onChange={(event) => setP2(event.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button type="submit">Joacă rundă</button>
          <button type="button" className="ghost" onClick={resetGame}>
            Reset
          </button>
        </div>
      </form>

      <article className={`result ${currentResult.winner ? 'active' : ''}`}>
        <h2>Rezultat curent</h2>
        <p>{currentResult.message}</p>
      </article>

      <section className="scoreboard" aria-label="Scor">
        <div>
          <strong>{score.p1}</strong>
          <span>Player 1</span>
        </div>
        <div>
          <strong>{score.draws}</strong>
          <span>Egaluri</span>
        </div>
        <div>
          <strong>{score.p2}</strong>
          <span>Player 2</span>
        </div>
      </section>

      <section className="history">
        <h3>Ultimele runde</h3>
        {history.length === 0 ? (
          <p className="empty">Încă nu există runde jucate.</p>
        ) : (
          <ul>
            {history.map((round) => (
              <li key={round.id}>
                <span>
                  {round.timestamp} — P1: {round.p1} vs P2: {round.p2}
                </span>
                <strong>{round.winner === 'E' ? 'Egal' : `Victorie ${round.winner}`}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

export default GameSection
