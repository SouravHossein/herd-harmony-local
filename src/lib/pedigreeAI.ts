import { Goat } from '@/types/goat';

export interface PedigreeValidation {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface InbreedingAnalysis {
  coefficient: number;
  risk: 'low' | 'moderate' | 'high' | 'extreme';
  commonAncestors: string[];
  recommendations: string[];
}

export class PedigreeAI {
  static validateParentage(
    goat: Goat, 
    fatherId?: string, 
    motherId?: string, 
    allGoats: Goat[] = []
  ): PedigreeValidation {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Prevent self-parenting
    if (fatherId === goat.id || motherId === goat.id) {
      errors.push('A goat cannot be its own parent');
    }

    // Prevent same goat as both parents
    if (fatherId && motherId && fatherId === motherId) {
      errors.push('A goat cannot have the same parent as both father and mother');
    }

    // Check for circular relationships
    if (fatherId && this.wouldCreateCircularRelationship(goat.id, fatherId, allGoats)) {
      errors.push('This would create a circular relationship in the pedigree');
    }
    
    if (motherId && this.wouldCreateCircularRelationship(goat.id, motherId, allGoats)) {
      errors.push('This would create a circular relationship in the pedigree');
    }

    // Age validation
    const father = fatherId ? allGoats.find(g => g.id === fatherId) : null;
    const mother = motherId ? allGoats.find(g => g.id === motherId) : null;

    if (father && new Date(father.dateOfBirth) >= new Date(goat.dateOfBirth)) {
      warnings.push('Father appears to be born after or same time as offspring');
    }

    if (mother && new Date(mother.dateOfBirth) >= new Date(goat.dateOfBirth)) {
      warnings.push('Mother appears to be born after or same time as offspring');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }

  static calculateInbreedingCoefficient(
    sireId: string,
    damId: string,
    allGoats: Goat[]
  ): InbreedingAnalysis {
    const sireAncestors = this.getAllAncestors(sireId, allGoats);
    const damAncestors = this.getAllAncestors(damId, allGoats);
    
    const commonAncestors = sireAncestors.filter(id => damAncestors.includes(id));
    
    // Simplified inbreeding coefficient calculation
    let coefficient = 0;
    for (const ancestorId of commonAncestors) {
      const sireDistance = this.getGenerationDistance(sireId, ancestorId, allGoats);
      const damDistance = this.getGenerationDistance(damId, ancestorId, allGoats);
      coefficient += Math.pow(0.5, sireDistance + damDistance + 1);
    }

    let risk: 'low' | 'moderate' | 'high' | 'extreme';
    if (coefficient < 0.0625) risk = 'low';
    else if (coefficient < 0.125) risk = 'moderate';
    else if (coefficient < 0.25) risk = 'high';
    else risk = 'extreme';

    const recommendations = this.getInbreedingRecommendations(coefficient, risk);

    return {
      coefficient,
      risk,
      commonAncestors,
      recommendations
    };
  }

  private static wouldCreateCircularRelationship(
    goatId: string,
    parentId: string,
    allGoats: Goat[]
  ): boolean {
    // Check if parentId is a descendant of goatId
    return this.isDescendant(parentId, goatId, allGoats);
  }

  private static isDescendant(
    potentialDescendantId: string,
    ancestorId: string,
    allGoats: Goat[],
    visited: Set<string> = new Set()
  ): boolean {
    if (visited.has(potentialDescendantId)) return false;
    visited.add(potentialDescendantId);

    const descendant = allGoats.find(g => g.id === potentialDescendantId);
    if (!descendant) return false;

    if (descendant.fatherId === ancestorId || descendant.motherId === ancestorId) {
      return true;
    }

    const hasDescendantThroughFather = descendant.fatherId ? 
      this.isDescendant(descendant.fatherId, ancestorId, allGoats, visited) : false;
    
    const hasDescendantThroughMother = descendant.motherId ? 
      this.isDescendant(descendant.motherId, ancestorId, allGoats, visited) : false;

    return hasDescendantThroughFather || hasDescendantThroughMother;
  }

  private static getAllAncestors(
    goatId: string,
    allGoats: Goat[],
    ancestors: string[] = [],
    visited: Set<string> = new Set()
  ): string[] {
    if (visited.has(goatId)) return ancestors;
    visited.add(goatId);

    const goat = allGoats.find(g => g.id === goatId);
    if (!goat) return ancestors;

    if (goat.fatherId && !ancestors.includes(goat.fatherId)) {
      ancestors.push(goat.fatherId);
      this.getAllAncestors(goat.fatherId, allGoats, ancestors, visited);
    }

    if (goat.motherId && !ancestors.includes(goat.motherId)) {
      ancestors.push(goat.motherId);
      this.getAllAncestors(goat.motherId, allGoats, ancestors, visited);
    }

    return ancestors;
  }

  private static getGenerationDistance(
    descendantId: string,
    ancestorId: string,
    allGoats: Goat[],
    distance: number = 0,
    visited: Set<string> = new Set()
  ): number {
    if (descendantId === ancestorId) return distance;
    if (visited.has(descendantId)) return Infinity;
    visited.add(descendantId);

    const descendant = allGoats.find(g => g.id === descendantId);
    if (!descendant) return Infinity;

    const fatherDistance = descendant.fatherId ? 
      this.getGenerationDistance(descendant.fatherId, ancestorId, allGoats, distance + 1, visited) : 
      Infinity;
    
    const motherDistance = descendant.motherId ? 
      this.getGenerationDistance(descendant.motherId, ancestorId, allGoats, distance + 1, visited) : 
      Infinity;

    return Math.min(fatherDistance, motherDistance);
  }

  private static getInbreedingRecommendations(
    coefficient: number,
    risk: 'low' | 'moderate' | 'high' | 'extreme'
  ): string[] {
    const recommendations: string[] = [];

    switch (risk) {
      case 'extreme':
        recommendations.push('Strongly avoid this breeding - extremely high inbreeding risk');
        recommendations.push('Consider using unrelated breeding stock');
        break;
      case 'high':
        recommendations.push('High inbreeding risk - proceed with caution');
        recommendations.push('Monitor offspring closely for genetic defects');
        recommendations.push('Consider outcrossing in next generation');
        break;
      case 'moderate':
        recommendations.push('Moderate inbreeding - acceptable but monitor offspring');
        recommendations.push('Ensure genetic diversity in future breedings');
        break;
      case 'low':
        recommendations.push('Low inbreeding risk - generally acceptable');
        break;
    }

    return recommendations;
  }

  static generatePedigreeInsights(goat: Goat, allGoats: Goat[]): string[] {
    const insights: string[] = [];
    
    // Check for missing parents
    if (!goat.fatherId && !goat.motherId) {
      insights.push('No parentage information available - consider adding if known');
    } else if (!goat.fatherId) {
      insights.push('Father information missing - adds to genetic record if available');
    } else if (!goat.motherId) {
      insights.push('Mother information missing - important for breeding decisions');
    }

    // Check generation depth
    const ancestors = this.getAllAncestors(goat.id, allGoats);
    if (ancestors.length > 10) {
      insights.push(`Rich pedigree with ${ancestors.length} known ancestors`);
    } else if (ancestors.length > 5) {
      insights.push('Good pedigree depth for breeding decisions');
    } else if (ancestors.length > 0) {
      insights.push('Basic pedigree information available');
    }

    return insights;
  }
}