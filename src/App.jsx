import { Navbar, Welcome, Services, Transactions, Footer } from './components'

function App() {

  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  )
}

export default App
