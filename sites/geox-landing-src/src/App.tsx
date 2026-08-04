import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Platform from './pages/Platform'
import McpApps from './pages/McpApps'
import WebMcp from './pages/WebMcp'
import Federation from './pages/Federation'
import Deploy from './pages/Deploy'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="platform" element={<Platform />} />
        <Route path="mcp-apps" element={<McpApps />} />
        <Route path="webmcp" element={<WebMcp />} />
        <Route path="federation" element={<Federation />} />
        <Route path="deploy" element={<Deploy />} />
      </Route>
    </Routes>
  )
}
