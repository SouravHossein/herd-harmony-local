
class PedigreeService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  getPedigreeTree(goatId, generations = 3) {
    const goats = this.db.getAll('goats');
    const breedingRecords = this.db.getAll('breedingRecords');
    
    const nodes = [];
    const edges = [];
    const processedIds = new Set();
    
    const processGoat = (currentGoatId, generation, x, y) => {
      if (generation > generations || processedIds.has(currentGoatId)) return;
      
      const goat = goats.find(g => g.id === currentGoatId);
      if (!goat) return;
      
      processedIds.add(currentGoatId);
      
      // Add goat node
      nodes.push({
        id: currentGoatId,
        type: 'pedigreeNode',
        position: { x, y },
        data: {
          goat,
          generation
        }
      });
      
      // Find parents through breeding records
      const breeding = breedingRecords.find(br => br.kidIds.includes(currentGoatId));
      if (breeding && generation < generations) {
        const sire = goats.find(g => g.id === breeding.sireId);
        const dam = goats.find(g => g.id === breeding.damId);
        
        if (sire) {
          const sireX = x - 200;
          const sireY = y - 100;
          processGoat(sire.id, generation + 1, sireX, sireY);
          edges.push({
            id: `${sire.id}-${currentGoatId}`,
            source: sire.id,
            target: currentGoatId,
            type: 'smoothstep',
            style: { stroke: '#3B82F6' }
          });
        }
        
        if (dam) {
          const damX = x - 200;
          const damY = y + 100;
          processGoat(dam.id, generation + 1, damX, damY);
          edges.push({
            id: `${dam.id}-${currentGoatId}`,
            source: dam.id,
            target: currentGoatId,
            type: 'smoothstep',
            style: { stroke: '#EC4899' }
          });
        }
      }
    };
    
    processGoat(goatId, 0, 0, 0);
    
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
    const breedingRecords = this.db.getAll('breedingRecords');
    const goats = this.db.getAll('goats');
    
    const breeding = breedingRecords.find(br => br.kidIds.includes(goatId));
    if (breeding) {
      const sire = goats.find(g => g.id === breeding.sireId);
      const dam = goats.find(g => g.id === breeding.damId);
      
      if (sire) {
        ancestors.push(sire);
        ancestors.push(...this.getAllAncestors(sire.id, visited));
      }
      
      if (dam) {
        ancestors.push(dam);
        ancestors.push(...this.getAllAncestors(dam.id, visited));
      }
    }
    
    return ancestors;
  }

  getPathLength(descendantId, ancestorId, visited = new Set()) {
    if (visited.has(descendantId)) return -1;
    if (descendantId === ancestorId) return 0;
    
    visited.add(descendantId);
    const breedingRecords = this.db.getAll('breedingRecords');
    
    const breeding = breedingRecords.find(br => br.kidIds.includes(descendantId));
    if (!breeding) return -1;
    
    const sireLength = this.getPathLength(breeding.sireId, ancestorId, new Set(visited));
    const damLength = this.getPathLength(breeding.damId, ancestorId, new Set(visited));
    
    const validLengths = [sireLength, damLength].filter(length => length >= 0);
    return validLengths.length > 0 ? Math.min(...validLengths) + 1 : -1;
  }
}

module.exports = PedigreeService;
