import { Navigate } from 'react-router-dom';

export function MakcikGPTAlias() {
  // The MakcikGPT landing is its own content surface; the URL kept the
  // /wealth/makcikgpt prefix for backwards compatibility, so this is just
  // an alias wrapper that routes to the same page. The MakcikGPT URL is
  // the public one.
  return <Navigate to="/wealth/makcikgpt/index" replace />;
}

export default MakcikGPTAlias;
