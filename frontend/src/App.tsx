import { useState } from 'react'
import './App.css'

function App() {
  const [sleep, setSleep] = useState(8)
  const [meetings, setMeetings] = useState(0)
  const [weekends, setWeekends] = useState(false)
  const [stress, setStress] = useState(5)
  const [prediction, setPrediction] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  async function handlePredict() {
    setIsLoading(true)
    setPrediction('')

    const input = {
      sleep: sleep,
      meetings: meetings,
      weekends: weekends,
      stress: stress,
    }

    try {
      // בקשת פוסט אימון לעץ
      const trainResponse = await fetch('/api/train', {
        method: 'POST',
      })

      if (!trainResponse.ok) {
        throw new Error('Failed to train the tree')
      }

      // בקשת פוסט מבצעת  חיזוי 
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Prediction failed')
      }

      setPrediction(data.prediction)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main dir="ltr">
      <h1>Developer Burnout Analysis</h1>
      <p>Enter your daily habits to predict your burnout level.</p>

      <label htmlFor="sleep">
        Average sleep hours: {sleep}
      </label>

      <input
        id="sleep"
        type="range"
        min="0"
        max="24"
        step="0.5"
        value={sleep}
        onChange={(event) => setSleep(Number(event.target.value))}
      />

      <div>
        <label htmlFor="meetings">
          Meetings per day: {meetings}
        </label>

        <input
          id="meetings"
          type="range"
          min="0"
          max="20"
          step="1"
          value={meetings}
          onChange={(event) => setMeetings(Number(event.target.value))}
        />
      </div>

      <div>
        <label htmlFor="stress">
          Stress level: {stress}
        </label>

        <input
          id="stress"
          type="range"
          min="1"
          max="10"
          step="1"
          value={stress}
          onChange={(event) => setStress(Number(event.target.value))}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={weekends}
            onChange={(event) => setWeekends(event.target.checked)}
          />
          I work on weekends
        </label>
      </div>

      <button
        type="button"
        onClick={handlePredict}
        disabled={isLoading}
      >
        {isLoading ? 'Predicting...' : 'Predict burnout'}
      </button>
      {/* מראה את תוצאות החיזוי */}

      {prediction !== '' ? (
        <div>
          <h2>Your result</h2>
          <p>{prediction}</p>
        </div>
      ) : null}

    </main>
  )
}

export default App