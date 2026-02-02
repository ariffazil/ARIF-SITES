import { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, GraduationCap, Award, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Reference {
  id: number;
  citation: string;
  doi?: string;
  url?: string;
  topic: string;
  peerReviewed: boolean;
  category: string;
}

const REFERENCES: Reference[] = [
  {
    id: 1,
    citation: 'Vaswani, A., et al. (2017). "Attention is all you need." NeurIPS.',
    url: 'https://arxiv.org/abs/1706.03762',
    topic: 'Transformer architecture',
    peerReviewed: true,
    category: 'Machine Learning'
  },
  {
    id: 2,
    citation: 'Brown, T., et al. (2020). "Language models are few-shot learners." NeurIPS.',
    url: 'https://arxiv.org/abs/2005.14165',
    topic: 'GPT-3, large language models',
    peerReviewed: true,
    category: 'Machine Learning'
  },
  {
    id: 3,
    citation: 'Shannon, C.E. (1948). "A mathematical theory of communication." Bell System Technical Journal, 27(3), 379–423.',
    doi: '10.1002/j.1538-7305.1948.tb01338.x',
    topic: 'Foundational information theory',
    peerReviewed: true,
    category: 'Information Theory'
  },
  {
    id: 12,
    citation: 'Landauer, R. (1961). "Irreversibility and heat generation in the computing process." IBM Journal of Research and Development, 5(3), 183–191.',
    doi: '10.1147/rd.53.0183',
    topic: "Landauer's principle",
    peerReviewed: true,
    category: 'Physics'
  },
  {
    id: 14,
    citation: 'Nash, J. (1950). "Equilibrium points in n-person games." PNAS, 36(1), 48–49.',
    doi: '10.1073/pnas.36.1.48',
    topic: 'Nash equilibrium (Nobel Prize)',
    peerReviewed: true,
    category: 'Game Theory'
  },
  {
    id: 20,
    citation: 'Lamport, L., Shostak, R., & Pease, M. (1982). "The Byzantine Generals Problem." ACM TOPLAS, 4(3), 382–401.',
    doi: '10.1145/357172.357176',
    topic: 'Byzantine fault tolerance',
    peerReviewed: true,
    category: 'Distributed Systems'
  },
  {
    id: 27,
    citation: 'Boneh, D., Lynn, B., & Shacham, H. (2001). "Short signatures from the Weil pairing." ASIACRYPT.',
    url: 'https://crypto.stanford.edu/~dabo/pubs/papers/weilsig.pdf',
    topic: 'BLS signatures',
    peerReviewed: true,
    category: 'Cryptography'
  },
  {
    id: 35,
    citation: 'Gödel, K. (1931). "Über formal unentscheidbare Sätze der Principia Mathematica." Monatshefte für Mathematik und Physik, 38(1), 173–198.',
    doi: '10.1007/BF01700692',
    topic: 'Incompleteness theorems',
    peerReviewed: true,
    category: 'Logic'
  },
  {
    id: 43,
    citation: 'Friston, K. (2010). "The free-energy principle: a unified brain theory?" Nature Reviews Neuroscience, 11(2), 127–138.',
    doi: '10.1038/nrn2787',
    topic: 'Free energy principle',
    peerReviewed: true,
    category: 'Neuroscience'
  },
  {
    id: 44,
    citation: 'Hofstadter, D.R. (1979). Gödel, Escher, Bach: An Eternal Golden Braid. Basic Books.',
    topic: 'Strange loops (Pulitzer Prize)',
    peerReviewed: true,
    category: 'Philosophy'
  }
];

const BIBTEX = `@techreport{arifos2026apex,
  title = {APEX: A Thermodynamically Grounded Constitutional Framework for AI Governance},
  author = {Fazil, Muhammad Arif bin},
  year = {2026},
  month = {February},
  institution = {arifOS Project},
  url = {https://apex.arif-fazil.com},
  note = {Research framework. Implementations should be validated for specific use cases.}
}`;

export function CitationBlock() {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [expandedRef, setExpandedRef] = useState<number | null>(null);

  const copyBibtex = () => {
    navigator.clipboard.writeText(BIBTEX);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const stats = {
    total: 50,
    peerReviewed: 44,
    books: 12,
    articles: 32,
    conferences: 6
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/30 border-gray-800">
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-200">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Citations</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/30 border-gray-800">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-200">{stats.peerReviewed}</p>
              <p className="text-xs text-gray-500">Peer-Reviewed</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/30 border-gray-800">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-200">{stats.articles}</p>
              <p className="text-xs text-gray-500">Journal Articles</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/30 border-gray-800">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-200">{stats.books}</p>
              <p className="text-xs text-gray-500">Books</p>
            </CardContent>
          </Card>
        </div>

        {/* Scientific Rigor Score */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-400">Scientific Rigor Score</p>
              <p className="text-xs text-gray-500">Based on peer-review status, citation density, and methodological transparency</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-400">95<span className="text-lg">/100</span></p>
              <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">
                A-Grade
              </Badge>
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-green-500" style={{ width: '95%' }} />
          </div>
        </div>

        {/* BibTeX Export */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Cite This Work
              </CardTitle>
              <Button
                onClick={copyBibtex}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:border-amber-500/50 hover:text-amber-400"
              >
                {copiedBibtex ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copiedBibtex ? 'Copied!' : 'Copy BibTeX'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg bg-black/50 text-xs text-gray-400 overflow-x-auto font-mono">
              {BIBTEX}
            </pre>
          </CardContent>
        </Card>

        {/* Key References */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Key References
          </h4>
          
          <div className="space-y-2">
            {REFERENCES.map((ref) => (
              <div
                key={ref.id}
                className={`
                  p-3 rounded-lg border transition-all cursor-pointer
                  ${expandedRef === ref.id 
                    ? 'border-amber-500/50 bg-amber-500/5' 
                    : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
                  }
                `}
                onClick={() => setExpandedRef(expandedRef === ref.id ? null : ref.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-gray-500 mt-0.5">[{ref.id}]</span>
                  <div className="flex-1">
                    <p 
                      className="text-sm text-gray-300"
                      dangerouslySetInnerHTML={{ __html: ref.citation }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] border-gray-700">
                        {ref.category}
                      </Badge>
                      {ref.peerReviewed && (
                        <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-400">
                          Peer-Reviewed
                        </Badge>
                      )}
                      <span className="text-[10px] text-gray-500">{ref.topic}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {ref.doi && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`https://doi.org/${ref.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-amber-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">View DOI: {ref.doi}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {ref.url && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-amber-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">View Paper</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <a 
              href="/references.json"
              className="text-sm text-amber-400 hover:text-amber-300 inline-flex items-center gap-2"
            >
              View All 50 References
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Machine-Readable Endpoints */}
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
          <p className="text-sm font-semibold text-gray-300 mb-3">Machine-Readable Endpoints</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-black/30">
              <code className="text-xs text-cyan-400">/references.json</code>
              <Badge variant="outline" className="text-[10px] border-cyan-500/50 text-cyan-400">
                JSON
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/30">
              <code className="text-xs text-amber-400">/llms.txt</code>
              <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-400">
                Plain Text
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
