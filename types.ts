// types.ts
export interface Probabilities {
    P_E: number;  
    P_E_given_H: number;
    P_E_given_not_H: number;
    P_H_given_E: number;
    P_H: number;
    P_E_given_H_CoT: string;
    P_E_given_not_H_CoT: string;
    P_H_given_E_CoT: string;
    P_H_CoT: string;
    P_population_noun: string;
    P_population_description: string;
    hypothesisEvidence: string;
    hypothesisNotEvidence: string;
    notHypothesisEvidence: string;
    notHypothesisNotEvidence: string;
  }