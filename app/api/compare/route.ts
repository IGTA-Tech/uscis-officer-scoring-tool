/**
 * RFE Comparison API Route
 *
 * Compares before/after RFE response scoring to show improvement.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScoringResults, isSupabaseConfigured } from '@/app/lib/database/supabase';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beforeSessionId, afterSessionId } = body;

    // Validate inputs
    if (!beforeSessionId || !uuidRegex.test(beforeSessionId)) {
      return NextResponse.json({ error: 'Valid beforeSessionId is required' }, { status: 400 });
    }

    if (!afterSessionId || !uuidRegex.test(afterSessionId)) {
      return NextResponse.json({ error: 'Valid afterSessionId is required' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Get both scoring results
    const beforeResults = await getScoringResults(beforeSessionId);
    const afterResults = await getScoringResults(afterSessionId);

    if (!beforeResults) {
      return NextResponse.json({ error: 'Before scoring results not found' }, { status: 404 });
    }

    if (!afterResults) {
      return NextResponse.json({ error: 'After scoring results not found' }, { status: 404 });
    }

    // Calculate comparison
    const comparison = {
      overallScore: {
        before: beforeResults.overall_score,
        after: afterResults.overall_score,
        change: afterResults.overall_score - beforeResults.overall_score,
        improved: afterResults.overall_score > beforeResults.overall_score,
      },
      approvalProbability: {
        before: beforeResults.approval_probability,
        after: afterResults.approval_probability,
        change: afterResults.approval_probability - beforeResults.approval_probability,
        improved: afterResults.approval_probability > beforeResults.approval_probability,
      },
      rfeProbability: {
        before: beforeResults.rfe_probability,
        after: afterResults.rfe_probability,
        change: afterResults.rfe_probability - beforeResults.rfe_probability,
        improved: afterResults.rfe_probability < beforeResults.rfe_probability,
      },
      denialRisk: {
        before: beforeResults.denial_risk,
        after: afterResults.denial_risk,
        change: afterResults.denial_risk - beforeResults.denial_risk,
        improved: afterResults.denial_risk < beforeResults.denial_risk,
      },
      criteriaComparison: compareCriteria(
        beforeResults.criteria_scores as CriterionScore[],
        afterResults.criteria_scores as CriterionScore[]
      ),
      weaknessesResolved: findResolvedItems(
        beforeResults.weaknesses as string[],
        afterResults.weaknesses as string[]
      ),
      newStrengths: findNewItems(
        beforeResults.strengths as string[],
        afterResults.strengths as string[]
      ),
      summary: generateComparisonSummary(beforeResults, afterResults),
    };

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error('[Compare] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Comparison failed' },
      { status: 500 }
    );
  }
}

interface CriterionScore {
  criterionNumber: number;
  criterionName: string;
  rating: string;
  score: number;
}

function compareCriteria(before: CriterionScore[], after: CriterionScore[]): Array<{
  criterionNumber: number;
  criterionName: string;
  before: { rating: string; score: number };
  after: { rating: string; score: number };
  change: number;
  improved: boolean;
}> {
  const beforeMap = new Map(before.map(c => [c.criterionNumber, c]));
  const afterMap = new Map(after.map(c => [c.criterionNumber, c]));

  const comparison = [];

  for (const [num, beforeCrit] of beforeMap) {
    const afterCrit = afterMap.get(num);
    if (afterCrit) {
      comparison.push({
        criterionNumber: num,
        criterionName: beforeCrit.criterionName,
        before: { rating: beforeCrit.rating, score: beforeCrit.score },
        after: { rating: afterCrit.rating, score: afterCrit.score },
        change: afterCrit.score - beforeCrit.score,
        improved: afterCrit.score > beforeCrit.score,
      });
    }
  }

  return comparison.sort((a, b) => b.change - a.change);
}

function findResolvedItems(before: string[], after: string[]): string[] {
  const afterSet = new Set(after.map(s => s.toLowerCase()));
  return before.filter(item => !afterSet.has(item.toLowerCase()));
}

function findNewItems(before: string[], after: string[]): string[] {
  const beforeSet = new Set(before.map(s => s.toLowerCase()));
  return after.filter(item => !beforeSet.has(item.toLowerCase()));
}

function generateComparisonSummary(before: Record<string, unknown>, after: Record<string, unknown>): string {
  const scoreDiff = (after.overall_score as number) - (before.overall_score as number);
  const approvalDiff = (after.approval_probability as number) - (before.approval_probability as number);

  if (scoreDiff > 20 && approvalDiff > 20) {
    return 'Excellent improvement! The RFE response significantly strengthened the petition.';
  } else if (scoreDiff > 10 || approvalDiff > 10) {
    return 'Good progress. The RFE response addressed several key concerns.';
  } else if (scoreDiff > 0) {
    return 'Modest improvement. Consider addressing remaining weaknesses.';
  } else if (scoreDiff === 0) {
    return 'No significant change. The RFE response may not have addressed core issues.';
  } else {
    return 'Scores decreased. Review the RFE response for potential issues introduced.';
  }
}
