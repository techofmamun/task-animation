import PageButtonContainer from './components/PageButtonContainer'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <PageButtonContainer />
      </div>
    </ErrorBoundary>
  )
}

export default App
