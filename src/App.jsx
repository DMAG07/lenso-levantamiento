import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/shared/ScrollToTop'
import Home from './modules/Home'
import InvestmentAnalysisV2 from './modules/InvestmentAnalysisV2'
import ServiceProposal from './modules/ServiceProposal'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investment-analysis" element={<InvestmentAnalysisV2 />} />
        <Route path="/service-proposal" element={<ServiceProposal />} />
        {/* Future routes */}
        {/* <Route path="/investor-relations" element={<InvestorRelations />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
