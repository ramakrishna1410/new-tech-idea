export type AnswerKey =
  | "deathCertificate"
  | "legalHeirCertificate"
  | "ownedProperty"
  | "hadBankAccounts"
  | "bankNominee"
  | "hadInsurance"
  | "hadEpfOrPension"
  | "hadElectricityConnection"
  | "hadGasConnection"
  | "ownedVehicle"
  | "hadPan";

export type AnswerValue = "yes" | "no" | "unknown";

export type Answers = Partial<Record<AnswerKey, AnswerValue>>;

export interface IntakeOption {
  value: AnswerValue;
  label: string;
}

export interface IntakeQuestion {
  key: AnswerKey;
  question: string;
  helpText?: string;
  options: IntakeOption[];
}

const yesNo: IntakeOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Not sure" },
];

export const intakeQuestions: IntakeQuestion[] = [
  {
    key: "deathCertificate",
    question: "Have you already obtained the death certificate?",
    helpText:
      "Issued by the local municipality / Corporation. Needed for almost every other step, so this comes first if you don't have it yet.",
    options: yesNo,
  },
  {
    key: "legalHeirCertificate",
    question: "Do you already have a Legal Heir (Varisu) Certificate?",
    helpText: "Issued by the Taluk Tahsildar's office or via the TN e-Sevai portal.",
    options: yesNo,
  },
  {
    key: "ownedProperty",
    question: "Did the deceased own any land or property in Tamil Nadu?",
    helpText: "Includes house, flat, or agricultural land with a patta/chitta record.",
    options: yesNo,
  },
  {
    key: "hadBankAccounts",
    question: "Did the deceased have bank account(s) or fixed deposits?",
    options: yesNo,
  },
  {
    key: "bankNominee",
    question: "If yes — was a nominee registered on those accounts?",
    helpText: "This changes how the bank claim process works. Skip if not applicable.",
    options: yesNo,
  },
  {
    key: "hadInsurance",
    question: "Did the deceased have a life insurance policy (e.g. LIC)?",
    options: yesNo,
  },
  {
    key: "hadEpfOrPension",
    question: "Did the deceased have an EPF account or a government/private pension?",
    options: yesNo,
  },
  {
    key: "hadElectricityConnection",
    question: "Was there an electricity (TANGEDCO) connection in the deceased's name?",
    options: yesNo,
  },
  {
    key: "hadGasConnection",
    question: "Was there an LPG gas connection in the deceased's name?",
    options: yesNo,
  },
  {
    key: "ownedVehicle",
    question: "Did the deceased own a vehicle (car / two-wheeler)?",
    options: yesNo,
  },
  {
    key: "hadPan",
    question: "Did the deceased have a PAN card / file income tax returns?",
    options: yesNo,
  },
];
