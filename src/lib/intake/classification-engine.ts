import type { IntakeQuestion } from "./classification";

export type ClassificationResult = {
  risk_tier: "prohibited" | "high_risk" | "limited_risk" | "minimal_risk" | "unknown";
  reasons: string[];
};

export type IntakeAnswers = Record<string, any>;

function yn(v: any): boolean | null {
  if (v === true || v === "yes" || v === "true") return true;
  if (v === false || v === "no" || v === "false") return false;
  return null;
}

export function classifyFromAnswers(answers: IntakeAnswers): ClassificationResult {
  const reasons: string[] = [];

  const subliminal = yn(answers["subliminal_or_manipulative"]);
  const exploitVuln = yn(answers["vulnerable_groups_exploitation"]);
  const socialScoring = yn(answers["social_scoring"]);
  const emotionWorkEdu = yn(answers["emotion_recognition_work_or_education"]);
  const policingPublicSpace = yn(answers["used_in_public_space_for_policing"]);

  // PROHIBITED (simplified gating)
  if (subliminal === true) reasons.push("Uses subliminal/manipulative techniques.");
  if (exploitVuln === true) reasons.push("Designed to exploit vulnerable groups.");
  if (socialScoring === true) reasons.push("Performs social scoring.");
  if (emotionWorkEdu === true) reasons.push("Emotion recognition in workplace/education context.");
  // Note: law enforcement public-space biometric identification is sensitive; we treat as prohibited candidate here.
  if (policingPublicSpace === true) reasons.push("Used in public spaces for law enforcement purposes.");

  if (
    subliminal === true ||
    exploitVuln === true ||
    socialScoring === true ||
    emotionWorkEdu === true ||
    policingPublicSpace === true
  ) {
    return { risk_tier: "prohibited", reasons };
  }

  const affectsRights = yn(answers["affects_legal_rights"]);
  const decisionsAboutPeople = yn(answers["makes_or_supports_decisions"]);
  const safetyComponent = yn(answers["safety_component"]);
  const biometric = yn(answers["biometric_identification"]);

  // HIGH-RISK (simplified gating)
  if (safetyComponent === true) reasons.push("Acts as a safety component of a product/safety function.");
  if (decisionsAboutPeople === true && affectsRights === true)
    reasons.push("Makes/supports decisions about people that can affect rights/opportunities.");
  if (biometric === true) reasons.push("Performs biometric identification/categorisation.");

  if (
    safetyComponent === true ||
    (decisionsAboutPeople === true && affectsRights === true) ||
    biometric === true
  ) {
    return { risk_tier: "high_risk", reasons };
  }

  const gpaI = yn(answers["gpaifoundation_model_used"]);
  if (gpaI === true) reasons.push("Uses a general-purpose AI/foundation model.");

  // LIMITED-RISK (placeholder)
  if (gpaI === true) {
    return { risk_tier: "limited_risk", reasons };
  }

  return { risk_tier: "minimal_risk", reasons: reasons.length ? reasons : ["No high-risk/prohibited triggers found."] };
}
