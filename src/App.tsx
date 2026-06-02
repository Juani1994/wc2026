import { Analytics } from '@vercel/analytics/react'
import GroupStage from './pages/GroupStage'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <GroupStage />
      <Footer />
      <Analytics />
    </>
  )
}

export default App
