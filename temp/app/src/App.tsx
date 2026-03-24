import { 
  Terminal, Copy, Check, ExternalLink, Github, 
  Package, Zap, Shield, Activity, ChevronRight,
  Server, FileText, Cpu, Globe, Lock, Workflow,
  Download, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

// Navigation Component
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/90 backdrop-blur-lg border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#79c0ff] flex items-center justify-center">
              <span className="text-sm font-bold text-[#0d1117]">a</span>
            </div>
            <span className="text-lg font-bold text-[#f0f6fc]">
              arif<span className="text-[#58a6ff]">OS</span>
            </span>
          </a>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#install" className="px-4 py-2 text-sm text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              Install
            </a>
            <a href="#tools" className="px-4 py-2 text-sm text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              Tools
            </a>
            <a href="#mcp" className="px-4 py-2 text-sm text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              MCP
            </a>
            <a href="#api" className="px-4 py-2 text-sm text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              API
            </a>
          </div>

          {/* Trinity Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#161b22] border border-[#30363d]">
            <a href="https://arif-fazil.com" className="px-3 py-1.5 text-xs font-medium rounded-md trinity-inactive transition-all hover:text-[#da3633]">
              HUMAN
            </a>
            <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 text-xs font-medium rounded-md trinity-inactive transition-all hover:text-[#d29922]">
              THEORY
            </a>
            <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 text-xs font-medium rounded-md trinity-active-blue transition-all">
              APPS
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#58a6ff]/10 blur-[120px] animate-pulse-glow" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#f0f6fc 1px, transparent 1px), linear-gradient(90deg, #f0f6fc 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161b22] border border-[#30363d] mb-8">
          <span className="w-2 h-2 rounded-full status-online animate-pulse" />
          <span className="text-xs font-medium text-[#8b949e] tracking-wider uppercase">
            v55.4 — ONLINE
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-gradient-blue">arif</span>
          <span className="text-[#f0f6fc]">OS</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-[#8b949e] mb-4">
          Constitutional Kernel for AI
        </p>

        {/* Description */}
        <p className="text-[#c9d1d9] max-w-2xl mx-auto mb-10 leading-relaxed">
          The 7-layer deployment architecture for constitutional AI governance. 
          From a simple system prompt to production MCP tools — every layer enforces 
          the 9 constitutional floors.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#58a6ff]">7</p>
            <p className="text-xs text-[#8b949e] uppercase tracking-wider">Layers</p>
          </div>
          <div className="w-px h-10 bg-[#30363d]" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#58a6ff]">9</p>
            <p className="text-xs text-[#8b949e] uppercase tracking-wider">Floors</p>
          </div>
          <div className="w-px h-10 bg-[#30363d]" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#58a6ff]">13</p>
            <p className="text-xs text-[#8b949e] uppercase tracking-wider">Constraints</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4">
          <a href="#install">
            <Button className="gap-2 bg-[#58a6ff] hover:bg-[#79c0ff] text-[#0d1117] font-semibold">
              <Download className="w-4 h-4" />
              Install
            </Button>
          </a>
          <a href="https://github.com/ariffazil/arifos" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 border-[#30363d] hover:border-[#58a6ff] text-[#c9d1d9]">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// Install Section
function InstallSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCommands = [
    { id: 'pip', label: 'Python (PyPI)', command: 'pip install arifos' },
    { id: 'npm', label: 'Node.js (npm)', command: 'npm install -g @arifos/mcp' },
    { id: 'docker', label: 'Docker', command: 'docker pull arifos/arifos:latest' }
  ];

  return (
    <section id="install" className="py-24 px-4 bg-[#161b22]/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#30363d] text-[#8b949e]">
            Quick Start
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f6fc]">
            Install <span className="text-gradient-blue">arifOS</span>
          </h2>
          <p className="text-[#8b949e] mt-4">
            Choose your installation method. All packages include the 9 Floors by default.
          </p>
        </div>

        <div className="space-y-4">
          {installCommands.map((item) => (
            <div key={item.id} className="glass-card rounded-lg p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#21262d] border-b border-[#30363d]">
                <span className="text-sm text-[#c9d1d9]">{item.label}</span>
                <Badge className="text-xs bg-[#58a6ff] text-[#0d1117]">{item.id}</Badge>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <code className="text-sm text-[#a5d6ff] font-mono">{item.command}</code>
                <button
                  onClick={() => copyToClipboard(item.command, item.id)}
                  className="p-2 rounded-lg hover:bg-[#21262d] transition-colors"
                >
                  {copied === item.id ? (
                    <Check className="w-4 h-4 text-[#238636]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#8b949e]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tools Section
function ToolsSection() {
  const tools = [
    {
      name: 'check_vital',
      icon: Activity,
      description: 'System health check with constitutional compliance status',
      example: 'arifos check-vital'
    },
    {
      name: 'verify_constraint',
      icon: Shield,
      description: 'Validate content against any of the 9 Floors',
      example: 'arifos verify --floor F1 --content "..."'
    },
    {
      name: 'apply_governance',
      icon: Lock,
      description: 'Apply full governance layer to AI-generated content',
      example: 'arifos govern --input file.txt'
    },
    {
      name: 'get_floor',
      icon: FileText,
      description: 'Retrieve detailed specification for any Floor',
      example: 'arifos floor --id F5'
    },
    {
      name: 'mcp_serve',
      icon: Server,
      description: 'Start the MCP server for Claude/Cursor integration',
      example: 'arifos mcp --port 8080'
    },
    {
      name: 'api_start',
      icon: Globe,
      description: 'Launch the REST API server',
      example: 'arifos api --host 0.0.0.0 --port 3000'
    }
  ];

  return (
    <section id="tools" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#30363d] text-[#8b949e]">
            CLI Tools
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f6fc]">
            Command <span className="text-gradient-blue">Reference</span>
          </h2>
          <p className="text-[#8b949e] mt-4">
            Built-in tools for governance, verification, and system management.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div 
              key={tool.name}
              className="glass-card rounded-lg p-5 hover:border-[#58a6ff] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 flex items-center justify-center mb-4 group-hover:bg-[#58a6ff]/20 transition-colors">
                <tool.icon className="w-5 h-5 text-[#58a6ff]" />
              </div>
              <h3 className="font-semibold text-[#f0f6fc] mb-2">{tool.name}</h3>
              <p className="text-sm text-[#8b949e] mb-3">{tool.description}</p>
              <code className="text-xs text-[#a5d6ff] bg-[#0d1117] px-2 py-1 rounded">{tool.example}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// MCP Section
function MCPSection() {
  const mcpConfig = `{
  "mcpServers": {
    "arifos": {
      "command": "npx",
      "args": ["-y", "@arifos/mcp"],
      "env": {
        "ARIFOS_API_KEY": "your-api-key"
      }
    }
  }
}`;

  return (
    <section id="mcp" className="py-24 px-4 bg-[#161b22]/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#30363d] text-[#8b949e]">
            Model Context Protocol
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f6fc]">
            MCP <span className="text-gradient-blue">Integration</span>
          </h2>
          <p className="text-[#8b949e] mt-4">
            Connect arifOS to Claude Desktop, Cursor, and any MCP-compatible client.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#58a6ff]" />
              Configuration
            </h3>
            <p className="text-sm text-[#8b949e] mb-4">
              Add this to your Claude Desktop configuration file:
            </p>
            <div className="code-block p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{mcpConfig}</code>
              </pre>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#8b949e]">
              <Zap className="w-4 h-4 text-[#d29922]" />
              <span>Tools appear automatically after restart</span>
            </div>
          </div>

          {/* Available Tools */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#58a6ff]" />
              MCP Tools
            </h3>
            <div className="space-y-3">
              {[
                { name: 'check_vital', desc: 'System health check' },
                { name: 'verify_constraint', desc: 'Validate against Floors' },
                { name: 'get_floor', desc: 'Get Floor specification' },
                { name: 'apply_governance', desc: 'Govern AI output' }
              ].map((tool) => (
                <div key={tool.name} className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117]">
                  <div>
                    <code className="text-sm text-[#58a6ff]">{tool.name}</code>
                    <p className="text-xs text-[#8b949e]">{tool.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#30363d]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <a href="https://aaa.arif-fazil.com/mcp" className="glass-card rounded-lg p-4 flex items-center gap-3 hover:border-[#58a6ff] transition-all group">
            <BookOpen className="w-5 h-5 text-[#58a6ff]" />
            <div>
              <p className="text-sm font-medium text-[#f0f6fc]">MCP Spec</p>
              <p className="text-xs text-[#8b949e]">Full protocol docs</p>
            </div>
          </a>
          <a href="https://aaa.arif-fazil.com/webmcp" className="glass-card rounded-lg p-4 flex items-center gap-3 hover:border-[#58a6ff] transition-all group">
            <Globe className="w-5 h-5 text-[#58a6ff]" />
            <div>
              <p className="text-sm font-medium text-[#f0f6fc]">WebMCP</p>
              <p className="text-xs text-[#8b949e]">Browser transport</p>
            </div>
          </a>
          <a href="https://aaa.arif-fazil.com/a2a" className="glass-card rounded-lg p-4 flex items-center gap-3 hover:border-[#58a6ff] transition-all group">
            <Workflow className="w-5 h-5 text-[#58a6ff]" />
            <div>
              <p className="text-sm font-medium text-[#f0f6fc]">A2A</p>
              <p className="text-xs text-[#8b949e]">Agent-to-Agent</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// API Section
function APISection() {
  const endpoints = [
    {
      method: 'POST',
      path: '/v1/constraint/check',
      description: 'Validate content against constitutional constraints'
    },
    {
      method: 'GET',
      path: '/v1/floors',
      description: 'Retrieve all 9 Floors with specifications'
    },
    {
      method: 'POST',
      path: '/v1/govern',
      description: 'Apply governance layer to AI output'
    },
    {
      method: 'GET',
      path: '/v1/health',
      description: 'System health and constraint engine status'
    },
    {
      method: 'GET',
      path: '/v1/layers',
      description: 'Get 7 Layers architecture overview'
    }
  ];

  const pythonExample = `import requests

# Initialize client
client = requests.Session()
client.headers.update({
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
})

# Check content against Floor 1 (Identity)
response = client.post(
    'https://api.arifos.arif-fazil.com/v1/constraint/check',
    json={
        'content': 'AI-generated text to validate',
        'floor_ids': ['F1', 'F3', 'F5']
    }
)

result = response.json()
print(f"Compliant: {result['compliant']}")
print(f"Score: {result['score']}")`;

  return (
    <section id="api" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#30363d] text-[#8b949e]">
            REST API
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f6fc]">
            API <span className="text-gradient-blue">Reference</span>
          </h2>
          <p className="text-[#8b949e] mt-4">
            Integrate constitutional governance into your applications.
          </p>
        </div>

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#21262d]">
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-[#58a6ff] data-[state=active]:text-[#0d1117]">
              Endpoints
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-[#58a6ff] data-[state=active]:text-[#0d1117]">
              Examples
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints" className="mt-6">
            <div className="space-y-3">
              {endpoints.map((endpoint) => (
                <div key={endpoint.path} className="glass-card rounded-lg p-4 flex items-center gap-4">
                  <Badge 
                    className={`text-xs font-mono ${
                      endpoint.method === 'GET' ? 'bg-[#58a6ff]' : 'bg-[#d29922]'
                    } text-[#0d1117]`}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm text-[#a5d6ff]">{endpoint.path}</code>
                  <span className="text-sm text-[#8b949e] ml-auto">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="mt-6">
            <div className="glass-card rounded-lg p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#21262d] border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#58a6ff]" />
                  <span className="text-sm text-[#c9d1d9]">Python SDK</span>
                </div>
                <Badge className="text-xs bg-[#58a6ff] text-[#0d1117]">v1.0</Badge>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{pythonExample}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* API Key */}
        <div className="mt-8 glass-card rounded-lg p-6 text-center">
          <p className="text-[#8b949e] mb-4">
            Need an API key? Contact us for access to the production API.
          </p>
          <a href="mailto:arif@arif-fazil.com">
            <Button variant="outline" className="gap-2 border-[#30363d] hover:border-[#58a6ff] text-[#c9d1d9]">
              Request Access
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[#30363d]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-[#f0f6fc]">
              arif<span className="text-[#58a6ff]">OS</span>
            </p>
            <p className="text-sm text-[#8b949e]">
              Constitutional Kernel for AI
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/ariffazil/arifos" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://apex.arif-fazil.com" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors">
              <BookOpen className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#30363d] text-center">
          <p className="text-xs text-[#8b949e]">
            v55.4 — SYSTEM_ONLINE — FORGED_IN_BLUE
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navigation />
      <main>
        <HeroSection />
        <InstallSection />
        <ToolsSection />
        <MCPSection />
        <APISection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
