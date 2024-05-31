// app/actions/submit.ts

'use server';

import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";
import { Probabilities } from '@/types';

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
  organization: process.env.OPENAI_ORG_ID ?? undefined
});

const client = Instructor({
  client: oai,
  mode: "FUNCTIONS"
});

const ProbabilitySchema = z.object({
  prior: z.string().describe("The estimated prior probability, between 0 and 1"),
  likelihood: z.string().describe("The estimated likelihood probability, between 0 and 1"),
  alternativeLikelihood: z.string().describe("The estimated alternative likelihood, between 0 and 1"),
  likelihoodChainOfThought: z.string().describe("Sequential reasoning to determine the correct likelihood"),
  alternativeLikelihoodChainOfThought: z.string().describe("Sequential reasoning to determine the correct alternative likelihood"),
  priorChainOfThought: z.string().describe("Sequential reasoning to determine the correct prior"),
  populationNoun: z.string().optional().describe("The noun representing the population, for example 'people' or 'students or 'proportion''"),
  shortDescriptionOfPopulation: z.string().optional().describe("A short description of the population, for example 'all people in the world' or 'students in a classroom' or 'all possible outcomes'"),
  hypothesisEvidence: z.string().optional().describe("A short human readable description of where the hypothesis is true, and the evidence is observed"),
  hypothesisNotEvidence: z.string().optional().describe("A short human readable description of where the hypothesis is true, and the evidence is not observed"),
  notHypothesisEvidence: z.string().optional().describe("A short human readable description of where the hypothesis is false, and the evidence is observed"),
  notHypothesisNotEvidence: z.string().optional().describe("A short human readable description of where the hypothesis is false, and the evidence is not observed"),
});

interface FormData {
  hypothesis: string;
  evidence: string;
}

// In-memory cache
const cache: Record<string, Probabilities> = {};

export async function submitForm({ hypothesis, evidence }: FormData): Promise<Probabilities> {
  console.log(`Submitting form with hypothesis: ${hypothesis} and evidence: ${evidence}`);
  
  // Generate a cache key based on the hypothesis and evidence
  const cacheKey = `${hypothesis}|${evidence}`;

  // Check if the response is already in the cache
  if (cache[cacheKey]) {
    console.log(`Returning cached response for key: ${cacheKey}`);
    return cache[cacheKey];
  }

  const prompt = `You will be estimating the likelihood, prior and probability of simply observing the evidence for a hypothesis given some evidence. 
      In Bayesian inference, the likelihood is the probability of the evidence occurring if the hypothesis is true. In other words, assuming the hypothesis is 100% true, what is the probability that we would observe this evidence?
      In Bayesian inference, the prior probability is the probability you would assign to this hypothesis being true before seeing any specific evidence for or against it. To estimate the prior, carefully consider how plausible this hypothesis is based on your general knowledge about how the world works.
      In Bayesian inference, the alternative likelihood is the probability of the evidence occurring if the hypothesis is false. In other words, assuming the hypothesis is 100% false, what is the probability that we would still observe this evidence? Think about the probability of simply observing this evidence in the real world, without any additional context, beliefs or hypotheses. In other words, if you randomly sampled situations from the real world, in what percentage of them would you expect to observe the evidence exactly as stated?
      
      The hypothesis is:
      "${hypothesis}"
      
      The evidence is:
      "${evidence}"
      
      Carefully consider the provided hypothesis and evidence. Think through how to estimate each probability step-by-step:
      
      1. Analyze the hypothesis and its assumptions.
      2. Evaluate the evidence in the context of the hypothesis.
      3. Use relevant statistical methods or knowledge to estimate the likelihood, prior and probability of simply observing this evidence.

      Provide your reasoning for each probability:

      - Prior probability: Explain why you assigned this prior probability.
      - Likelihood: Explain why you assigned this likelihood.
      - Alternative Likelihood: Explain why you assigned this alternative likelihood.
    `;
    
  const probabilities: Probabilities = {
    P_E_given_H: 0,
    P_E_given_not_H: 0,
    P_H_given_E: 0,
    P_H: 0,
    P_E: 0,
    P_E_given_H_CoT: "",
    P_H_CoT: "",
    P_E_given_not_H_CoT: "",
    P_population_noun: "",
    P_population_description: "",
    hypothesisEvidence: "",
    hypothesisNotEvidence: "",
    notHypothesisEvidence: "",
    notHypothesisNotEvidence: ""
  };

  const response = await client.chat.completions.create({
    messages: [
      { role: "user", content: prompt }
    ],
    model: "gpt-4o",
    response_model: {
      schema: ProbabilitySchema,
      name: "Probability"
    }
  });

  if (response) {
    console.log(`Received response:`, response);
    try {
      const parsedData = ProbabilitySchema.parse(response);
      probabilities.P_E_given_H = parseFloat(parsedData.likelihood);
      probabilities.P_E_given_not_H = parseFloat(parsedData.alternativeLikelihood);
      probabilities.P_H = parseFloat(parsedData.prior);
      probabilities.P_E = probabilities.P_E_given_H * probabilities.P_H + probabilities.P_E_given_not_H * (1 - probabilities.P_H);
      probabilities.P_H_given_E = probabilities.P_E_given_H * probabilities.P_H / probabilities.P_E;
      probabilities.P_E_given_H_CoT = parsedData.likelihoodChainOfThought;
      probabilities.P_H_CoT = parsedData.priorChainOfThought;
      probabilities.P_E_given_not_H_CoT = parsedData.alternativeLikelihoodChainOfThought;
      probabilities.P_population_noun = parsedData.populationNoun ?? "";
      probabilities.P_population_description = parsedData.shortDescriptionOfPopulation ?? "";
      probabilities.hypothesisEvidence = parsedData.hypothesisEvidence ?? "";
      probabilities.hypothesisNotEvidence = parsedData.hypothesisNotEvidence ?? "";
      probabilities.notHypothesisEvidence = parsedData.notHypothesisEvidence ?? "";
      probabilities.notHypothesisNotEvidence = parsedData.notHypothesisNotEvidence ?? "";

      // Cache the response
      cache[cacheKey] = probabilities;
    } catch (error) {
      console.error(`Error parsing response:`, error);
    }
  } else {
    console.error(`No response received}`); 
  }

  console.log(`Returning probabilities:`, probabilities);

  return probabilities;
}