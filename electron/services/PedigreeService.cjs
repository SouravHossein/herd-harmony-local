
class PedigreeService {
  constructor(databaseService) {
    this.db = databaseService;
  }

getPedigreeTree(goatId, generations = 3) {
  const goats = this.db.getAll('goats');
  
  const nodes = [];
  const edges = [];
  const processedIds = new Set();
  
  const addNode = (goat, x, y, generation) => {
    const nodeId = goat?.id || `unknown-${Math.random()}`;
    if (goat && processedIds.has(goat.id)) return nodeId;
    if (goat) processedIds.add(goat.id);

    // Father's photo URL (if any) for UI overlays
    const father = goat?.fatherId ? goats.find(g => g.id === goat.fatherId) : null;
    const fatherImageUrl = father?.mediaFiles?.find(m => m.type === 'image')?.url || null;

    nodes.push({
      id: nodeId,
      type: 'pedigreeNode',
      position: { x, y },
      data: {
        goat,
        generation,
        fatherImageUrl
      }
    });

    return nodeId;
  };

  const buildMaternalTree = (currentGoatId, generation, x, y) => {
    if (generation > generations) return;
    const goat = goats.find(g => g.id === currentGoatId);
    if (!goat) return;

    const nodeId = addNode(goat, x, y, generation);

    // Only traverse maternal line
    if (goat.motherId && generation < generations) {
      const motherX = x - 200;
      const motherY = y; // keep aligned vertically
      const motherId = buildMaternalTree(goat.motherId, generation + 1, motherX, motherY);
      if (motherId) {
        edges.push({
          id: `${goat.motherId}-${currentGoatId}`,
          source: goat.motherId,
          target: currentGoatId,
          type: 'smoothstep',
          style: { stroke: '#3B82F6' }
        });
      }
    }
  };
  
  buildMaternalTree(goatId, 0, 0, 0);
  
  return { nodes, edges };
}

  calculateInbreedingRisk(sireId, damId) {
    const commonAncestors = this.findCommonAncestors(sireId, damId);
    
    if (commonAncestors.length === 0) {
      return { risk: 0, commonAncestors: [] };
    }
    
    // Simple inbreeding coefficient calculation
    let inbreedingCoefficient = 0;
    commonAncestors.forEach(ancestor => {
      const pathLengthSire = this.getPathLength(sireId, ancestor.id);
      const pathLengthDam = this.getPathLength(damId, ancestor.id);
      
      if (pathLengthSire > 0 && pathLengthDam > 0) {
        inbreedingCoefficient += Math.pow(0.5, pathLengthSire + pathLengthDam + 1);
      }
    });
    
    return {
      risk: Math.round(inbreedingCoefficient * 100),
      commonAncestors
    };
  }

  findCommonAncestors(goatId1, goatId2) {
    const ancestors1 = this.getAllAncestors(goatId1);
    const ancestors2 = this.getAllAncestors(goatId2);
    
    const common = ancestors1.filter(ancestor1 => 
      ancestors2.some(ancestor2 => ancestor2.id === ancestor1.id)
    );
    
    return common;
  }

getAllAncestors(goatId, visited = new Set()) {
  if (visited.has(goatId)) return [];
  visited.add(goatId);
  const ancestors = [];
  const goats = this.db.getAll('goats');

  const goat = goats.find(g => g.id === goatId);
  if (!goat) return ancestors;

  if (goat.fatherId) {
    ancestors.push(goats.find(g => g.id === goat.fatherId));
    ancestors.push(...this.getAllAncestors(goat.fatherId, visited));
  }
  if (goat.motherId) {
    ancestors.push(goats.find(g => g.id === goat.motherId));
    ancestors.push(...this.getAllAncestors(goat.motherId, visited));
  }

  return ancestors.filter(Boolean);
}

getPathLength(descendantId, ancestorId, visited = new Set()) {
  if (visited.has(descendantId)) return -1;
  if (descendantId === ancestorId) return 0;
  
  visited.add(descendantId);
  const goats = this.db.getAll('goats');
  const goat = goats.find(g => g.id === descendantId);
  if (!goat) return -1;
  
  const fatherLength = goat.fatherId ? this.getPathLength(goat.fatherId, ancestorId, new Set(visited)) : -1;
  const motherLength = goat.motherId ? this.getPathLength(goat.motherId, ancestorId, new Set(visited)) : -1;
  
  const valid = [fatherLength, motherLength].filter(l => l >= 0);
  return valid.length ? Math.min(...valid) + 1 : -1;
}
}

module.exports = PedigreeService;
