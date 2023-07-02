import { Route, Routes } from 'react-router-dom'
import Index from '../pages/Index'

const Router = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Index />}
        />
      </Routes>
    </div>
  )
}

export default Router
