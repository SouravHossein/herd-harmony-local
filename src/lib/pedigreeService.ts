import { Goat, PedigreeNode, PedigreeRecord } from '@/types/goat';

export class PedigreeService {
  static buildPedigreeTree(
    selectedGoat: Goat,
    allGoats: Goat[],
    maxGenerations: number = 4
  ): { nodes: PedigreeNode[]; relationships: string[] } {
    const nodes: PedigreeNode[] = [];
    const relationships: string[] = [];
    const processedGoats = new Set<string>();

    const buildNode = (
      goat: Goat,
      generation: number,
      position: { x: number; y: number }
    ): PedigreeNode => {
      const node: PedigreeNode = {
        id: goat.id,
        name: goat.name,
        tagNumber: goat.tagNumber,
        photo: goat.imageId || goat.photoPath,
        traits: {
          coatColor: goat.color || 'unknown',
          hornStatus: goat.hornStatus === 'horned',
          fertilityScore: this.calculateFertilityScore(goat, allGoats),
        },
        parents: [],
        children: [],
        generation,
        position,
      };

      processedGoats.add(goat.id);
      return node;
    };

    const processGoat = (
      goat: Goat,
      generation: number,
      x: number,
      y: number
    ): PedigreeNode => {
      if (processedGoats.has(goat.id)) {
        return nodes.find(n => n.id === goat.id)!;
      }

      const node = buildNode(goat, generation, { x, y });
      nodes.push(node);

      if (generation < maxGenerations) {
        const spacing = 300;
        const verticalSpacing = 150;

        // Process father
        if (goat.fatherId) {
          const father = allGoats.find(g => g.id === goat.fatherId);
          if (father) {
            const fatherNode = processGoat(
              father,
              generation + 1,
              x + spacing,
              y - verticalSpacing
            );
            node.parents.push(fatherNode);
            fatherNode.children.push(node);
            relationships.push(`${father.name} is the father of ${goat.name}`);
          }
        }

        // Process mother
        if (goat.motherId) {
          const mother = allGoats.find(g => g.id === goat.motherId);
          if (mother) {
            const motherNode = processGoat(
              mother,
              generation + 1,
              x + spacing,
              y + verticalSpacing
            );
            node.parents.push(motherNode);
            motherNode.children.push(node);
            relationships.push(`${mother.name} is the mother of ${goat.name}`);
          }
        }
      }

      return node;
    };

    processGoat(selectedGoat, 0, 0, 0);

    return { nodes, relationships };
  }

  static calculateFertilityScore(goat: Goat, allGoats: Goat[]): number {
    // Basic fertility score calculation
    let score = 50; // Base score

    // Age factor
    const age = this.calculateAge(goat.birthDate);
    if (age >= 1 && age <= 8) {
      score += 30; // Prime breeding age
    } else if (age < 1 || age > 10) {
      score -= 20; // Too young or too old
    }

    // Breeding history
    const offspring = allGoats.filter(g => 
      g.fatherId === goat.id || g.motherId === goat.id
    );
    score += Math.min(offspring.length * 5, 20); // Max 20 points for offspring

    // Health status (simplified)
    if (goat.status === 'active') {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  static calculateAge(birthDate: Date): number {
    const now = new Date();
    const birth = new Date(birthDate);
    return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  static findCommonAncestors(goat1: Goat, goat2: Goat, allGoats: Goat[]): Goat[] {
    const ancestors1 = this.getAllAncestors(goat1, allGoats);
    const ancestors2 = this.getAllAncestors(goat2, allGoats);
    
    const commonAncestorIds = ancestors1.filter(id => ancestors2.includes(id));
    return commonAncestorIds.map(id => allGoats.find(g => g.id === id)!).filter(Boolean);
  }

  static getAllAncestors(goat: Goat, allGoats: Goat[], visited: Set<string> = new Set()): string[] {
    if (visited.has(goat.id)) return [];
    visited.add(goat.id);

    const ancestors: string[] = [];

    if (goat.fatherId) {
      const father = allGoats.find(g => g.id === goat.fatherId);
      if (father) {
        ancestors.push(father.id);
        ancestors.push(...this.getAllAncestors(father, allGoats, visited));
      }
    }

    if (goat.motherId) {
      const mother = allGoats.find(g => g.id === goat.motherId);
      if (mother) {
        ancestors.push(mother.id);
        ancestors.push(...this.getAllAncestors(mother, allGoats, visited));
      }
    }

    return [...new Set(ancestors)];
  }

  static getAllDescendants(goat: Goat, allGoats: Goat[]): Goat[] {
    const descendants: Goat[] = [];
    
    const directOffspring = allGoats.filter(g => 
      g.fatherId === goat.id || g.motherId === goat.id
    );
    
    descendants.push(...directOffspring);
    
    // Recursively find descendants of offspring
    directOffspring.forEach(offspring => {
      descendants.push(...this.getAllDescendants(offspring, allGoats));
    });
    
    return descendants;
  }

  static validatePedigreeRelationship(
    child: Goat,
    parent: Goat,
    allGoats: Goat[]
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Age validation
    const childAge = this.calculateAge(child.birthDate);
    const parentAge = this.calculateAge(parent.birthDate);
    
    if (parentAge <= childAge) {
      issues.push('Parent must be older than child');
    }

    if (parentAge - childAge < 1) {
      issues.push('Parent should be at least 1 year older than child');
    }

    // Circular relationship check
    const childAncestors = this.getAllAncestors(child, allGoats);
    if (childAncestors.includes(parent.id)) {
      issues.push('This would create a circular relationship');
    }

    // Self-parenting check
    if (child.id === parent.id) {
      issues.push('A goat cannot be its own parent');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static generatePedigreeReport(goat: Goat, allGoats: Goat[]): {
    generations: number;
    totalAncestors: number;
    knownAncestors: number;
    completenessPercentage: number;
    missingParents: string[];
    inbreedingRisk: 'low' | 'moderate' | 'high';
  } {
    const ancestors = this.getAllAncestors(goat, allGoats);
    const maxPossibleAncestors = Math.pow(2, 3) - 2; // 3 generations back (6 ancestors)
    
    const missingParents: string[] = [];
    if (!goat.fatherId) missingParents.push('Father');
    if (!goat.motherId) missingParents.push('Mother');

    // Simple inbreeding risk assessment
    let inbreedingRisk: 'low' | 'moderate' | 'high' = 'low';
    if (goat.fatherId && goat.motherId) {
      const father = allGoats.find(g => g.id === goat.fatherId);
      const mother = allGoats.find(g => g.id === goat.motherId);
      if (father && mother) {
        const commonAncestors = this.findCommonAncestors(father, mother, allGoats);
        if (commonAncestors.length > 2) {
          inbreedingRisk = 'high';
        } else if (commonAncestors.length > 0) {
          inbreedingRisk = 'moderate';
        }
      }
    }

    return {
      generations: Math.ceil(Math.log2(ancestors.length + 1)),
      totalAncestors: ancestors.length,
      knownAncestors: ancestors.length,
      completenessPercentage: Math.round((ancestors.length / maxPossibleAncestors) * 100),
      missingParents,
      inbreedingRisk
    };
  }
}