import type { LocalizedText } from "@/i18n/types";

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
  | "hadPan"
  | "hadRationCard"
  | "hadVoterId"
  | "hadPassport"
  | "hadMutualFundsOrDemat"
  | "hadMobileConnection";

export type AnswerValue = "yes" | "no" | "unknown";

export type Answers = Partial<Record<AnswerKey, AnswerValue>>;

export interface IntakeOption {
  value: AnswerValue;
  label: LocalizedText;
}

export interface IntakeQuestion {
  key: AnswerKey;
  question: LocalizedText;
  helpText?: LocalizedText;
  options: IntakeOption[];
}

const yesNo: IntakeOption[] = [
  { value: "yes", label: { en: "Yes", ta: "ஆம்" } },
  { value: "no", label: { en: "No", ta: "இல்லை" } },
  { value: "unknown", label: { en: "Not sure", ta: "தெரியவில்லை" } },
];

export const intakeQuestions: IntakeQuestion[] = [
  {
    key: "deathCertificate",
    question: {
      en: "Have you already obtained the death certificate?",
      ta: "இறப்புச் சான்றிதழை ஏற்கனவே பெற்றுவிட்டீர்களா?",
    },
    helpText: {
      en: "Issued by the local municipality / Corporation. Needed for almost every other step, so this comes first if you don't have it yet.",
      ta: "உள்ளூர் நகராட்சி / மாநகராட்சியால் வழங்கப்படும். இது கிட்டத்தட்ட மற்ற அனைத்து படிகளுக்கும் தேவை, எனவே இது இல்லையென்றால் முதலில் இதைப் பெறவும்.",
    },
    options: yesNo,
  },
  {
    key: "legalHeirCertificate",
    question: {
      en: "Do you already have a Legal Heir (Varisu) Certificate?",
      ta: "வாரிசுச் சான்றிதழ் (Legal Heir Certificate) ஏற்கனவே உள்ளதா?",
    },
    helpText: {
      en: "Issued by the Taluk Tahsildar's office or via the TN e-Sevai portal.",
      ta: "வட்டாட்சியர் அலுவலகம் அல்லது தமிழ்நாடு இ-சேவை போர்டல் மூலம் வழங்கப்படும்.",
    },
    options: yesNo,
  },
  {
    key: "ownedProperty",
    question: {
      en: "Did the deceased own any land or property in Tamil Nadu?",
      ta: "இறந்தவர் தமிழ்நாட்டில் நிலம் அல்லது சொத்து வைத்திருந்தாரா?",
    },
    helpText: {
      en: "Includes house, flat, or agricultural land with a patta/chitta record.",
      ta: "வீடு, குடியிருப்பு அல்லது பட்டா/சிட்டா பதிவு உள்ள விவசாய நிலம் ஆகியவை அடங்கும்.",
    },
    options: yesNo,
  },
  {
    key: "hadBankAccounts",
    question: {
      en: "Did the deceased have bank account(s) or fixed deposits?",
      ta: "இறந்தவருக்கு வங்கிக் கணக்குகள் அல்லது நிலையான வைப்புத் தொகைகள் இருந்தனவா?",
    },
    options: yesNo,
  },
  {
    key: "bankNominee",
    question: {
      en: "If yes — was a nominee registered on those accounts?",
      ta: "ஆம் எனில் — அந்தக் கணக்குகளில் நியமிதர் (Nominee) பதிவு செய்யப்பட்டிருந்தாரா?",
    },
    helpText: {
      en: "This changes how the bank claim process works. Skip if not applicable.",
      ta: "இது வங்கி உரிமைகோரல் செயல்முறையை மாற்றும். பொருந்தவில்லை எனில் தவிர்க்கவும்.",
    },
    options: yesNo,
  },
  {
    key: "hadInsurance",
    question: {
      en: "Did the deceased have a life insurance policy (e.g. LIC)?",
      ta: "இறந்தவருக்கு ஆயுள் காப்பீட்டு பாலிசி (எ.கா. LIC) இருந்ததா?",
    },
    options: yesNo,
  },
  {
    key: "hadEpfOrPension",
    question: {
      en: "Did the deceased have an EPF account or a government/private pension?",
      ta: "இறந்தவருக்கு EPF கணக்கு அல்லது அரசு/தனியார் ஓய்வூதியம் இருந்ததா?",
    },
    options: yesNo,
  },
  {
    key: "hadElectricityConnection",
    question: {
      en: "Was there an electricity (TANGEDCO) connection in the deceased's name?",
      ta: "இறந்தவரின் பெயரில் மின்சார (TANGEDCO) இணைப்பு இருந்ததா?",
    },
    options: yesNo,
  },
  {
    key: "hadGasConnection",
    question: {
      en: "Was there an LPG gas connection in the deceased's name?",
      ta: "இறந்தவரின் பெயரில் எல்பிஜி எரிவாயு இணைப்பு இருந்ததா?",
    },
    options: yesNo,
  },
  {
    key: "ownedVehicle",
    question: {
      en: "Did the deceased own a vehicle (car / two-wheeler)?",
      ta: "இறந்தவர் வாகனம் (கார் / இருசக்கர வாகனம்) வைத்திருந்தாரா?",
    },
    options: yesNo,
  },
  {
    key: "hadPan",
    question: {
      en: "Did the deceased have a PAN card / file income tax returns?",
      ta: "இறந்தவருக்கு பான் அட்டை இருந்ததா / வருமான வரி கோப்பு தாக்கல் செய்தாரா?",
    },
    options: yesNo,
  },
  {
    key: "hadRationCard",
    question: {
      en: "Was the deceased listed on a ration card (PDS)?",
      ta: "இறந்தவர் குடும்ப அட்டையில் (ரேஷன் கார்டு) பட்டியலிடப்பட்டிருந்தாரா?",
    },
    options: yesNo,
  },
  {
    key: "hadVoterId",
    question: {
      en: "Did the deceased have a Voter ID (EPIC)?",
      ta: "இறந்தவருக்கு வாக்காளர் அடையாள அட்டை (EPIC) இருந்ததா?",
    },
    options: yesNo,
  },
  {
    key: "hadPassport",
    question: {
      en: "Did the deceased hold a passport, or does a family member's passport list them as spouse/parent?",
      ta: "இறந்தவருக்கு கடவுச்சீட்டு இருந்ததா, அல்லது குடும்ப உறுப்பினர் ஒருவரின் கடவுச்சீட்டில் இவர் மனைவி/தந்தை/தாயாகக் குறிப்பிடப்பட்டுள்ளாரா?",
    },
    helpText: {
      en: "Relevant if a spouse or child will need to update their own passport details.",
      ta: "மனைவி அல்லது குழந்தை தங்கள் சொந்த கடவுச்சீட்டு விவரங்களைப் புதுப்பிக்க வேண்டியிருந்தால் இது பொருந்தும்.",
    },
    options: yesNo,
  },
  {
    key: "hadMutualFundsOrDemat",
    question: {
      en: "Did the deceased hold mutual funds, shares, or a demat account?",
      ta: "இறந்தவர் பரஸ்பர நிதி (Mutual Funds), பங்குகள் அல்லது டீமேட் கணக்கு வைத்திருந்தாரா?",
    },
    options: yesNo,
  },
  {
    key: "hadMobileConnection",
    question: {
      en: "Was there a mobile or DTH connection in the deceased's name?",
      ta: "இறந்தவரின் பெயரில் மொபைல் அல்லது டிடிஎச் இணைப்பு இருந்ததா?",
    },
    options: yesNo,
  },
];
