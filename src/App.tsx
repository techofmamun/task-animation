import FormPageManager from './components/FormPageManager'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <FormPageManager />
      </div>
    </ErrorBoundary>
  )
}

export default App
