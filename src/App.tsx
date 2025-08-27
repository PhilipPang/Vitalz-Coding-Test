import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white grid place-items-center font-bold">Phil</div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Monitoring Dashboard</h1>
            <p className="text-xs text-gray-500">Coding Test For Vitalz Sdn Bhd by Philip Pang</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Dashboard />
      </main>

      <footer className="text-center text-xs text-gray-400 py-8">© {new Date().getFullYear()} <a href="http://philippang.work/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Philip Pang</a></footer>
    </div>
  )
}
