import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider } from './i18n/LanguageContext'
import GroupStage from './pages/GroupStage'
import Footer from './components/Footer'

function App() {
  return (
    <LanguageProvider>
      <GroupStage />
      <Footer />
      <Analytics />
    </LanguageProvider>
  )
}

export default App
