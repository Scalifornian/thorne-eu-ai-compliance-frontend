export type IntakeQuestion = {
  section: string;
  question_key: string;
  label: string;
  help?: string;
  type: "single_select" | "multi_select" | "yes_no" | "text";
  options?: { value: string; label: string }[];
  required: boolean;
};

export const CLASSIFICATION_QUESTIONS: IntakeQuestion[] = [
  {
    section: "classification",
    question_key: "intended_purpose",
    label: "Intended purpose",
    help: "One sentence describing what the AI system is for.",
    type: "text",
    required: true,
  },
  {
    section: "classification",
    question_key: "who_uses_it",
    label: "Who uses it",
    type: "multi_select",
    required: true,
    options: [
      { value: "internal_staff", label: "Internal staff" },
      { value: "customers", label: "Customers / end users" },
      { value: "public", label: "General public" },
      { value: "public_authority", label: "Public authority / government body" },
    ],
  },
  {
    section: "classification",
    question_key: "deploy_context",
    label: "Deployment context",
    type: "single_select",
    required: true,
    options: [
      { value: "internal", label: "Internal only" },
      { value: "customer_facing", label: "Customer-facing product/service" },
      { value: "public_facing", label: "Public-facing" },
      { value: "critical_process", label: "Used in a critical business process" },
    ],
  },
  {
    section: "classification",
    question_key: "makes_or_supports_decisions",
    label: "Does it make decisions or materially support decisions about people?",
    help: "Examples: hiring, firing, admissions, credit, benefits, policing, border control, healthcare triage.",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "affects_legal_rights",
    label: "Could it affect a person’s legal rights, opportunities, or access to essential services?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "safety_component",
    label: "Is it a safety component of a product (or used in a product’s safety function)?",
    help: "Example: medical device safety, industrial machinery safety, vehicles.",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "biometric_identification",
    label: "Does it perform biometric identification or categorisation of people?",
    help: "Face recognition, voice ID, emotion inference, biometric categorisation.",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "used_in_public_space_for_policing",
    label: "Is it used in public spaces for law enforcement purposes?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "subliminal_or_manipulative",
    label: "Does it use subliminal techniques or manipulative methods to materially distort behaviour?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "vulnerable_groups_exploitation",
    label: "Is it designed to exploit vulnerabilities of specific groups (age, disability, etc.)?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "social_scoring",
    label: "Does it do social scoring of people (by a public or private entity)?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "emotion_recognition_work_or_education",
    label: "Does it do emotion recognition in workplaces or educational settings?",
    type: "yes_no",
    required: true,
  },
  {
    section: "classification",
    question_key: "gpaifoundation_model_used",
    label: "Does it use a general-purpose AI / foundation model (e.g., GPT, Claude, Gemini, LLaMA)?",
    type: "yes_no",
    required: true,
  },
];
