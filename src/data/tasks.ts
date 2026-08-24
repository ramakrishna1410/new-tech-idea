import type { Answers } from "./intakeQuestions";

export interface Task {
  id: string;
  title: string;
  office: string;
  documents: string[];
  fee: string;
  timeline: string;
  portalUrl?: string;
  portalLabel?: string;
  instructions: string;
  /** Task ids that must be completed before this one is actionable. */
  dependsOn: string[];
  /** Whether this task applies given the user's intake answers. */
  appliesIf: (answers: Answers) => boolean;
}

export const tasks: Task[] = [
  {
    id: "death-certificate",
    title: "Obtain the Death Certificate",
    office: "Local Municipality / Greater Chennai Corporation (Registrar of Births & Deaths)",
    documents: [
      "Hospital death intimation (if death occurred in hospital)",
      "Applicant ID proof",
      "Address proof of the deceased",
    ],
    fee: "Free for the first copy within 21 days; small fee for delayed registration or extra copies",
    timeline: "Same day to a few days if registered promptly",
    portalUrl: "https://tnreginet.gov.in/",
    portalLabel: "TN Registration Dept. / e-Sevai",
    instructions:
      "Request at least 8-10 certified copies — you will need to submit an original or attested copy for almost every task below (bank, insurance, EB, gas, RTO, pension).",
    dependsOn: [],
    appliesIf: (a) => a.deathCertificate !== "yes",
  },
  {
    id: "legal-heir-certificate",
    title: "Get the Legal Heir (Varisu) Certificate",
    office: "Taluk Tahsildar's Office / TN e-Sevai portal",
    documents: [
      "Death certificate",
      "Applicant ID proof (Aadhaar / Voter ID)",
      "Address proof",
      "Proof of relationship to the deceased",
      "Self-undertaking affidavit",
    ],
    fee: "Nominal fee, varies by taluk",
    timeline: "15-30 days",
    portalUrl: "https://www.tnesevai.tn.gov.in/",
    portalLabel: "TN e-Sevai portal",
    instructions:
      "This is the foundational document — almost every claim (property, bank, pension, vehicle) will ask for it. Apply as early as possible since it typically takes the longest.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.legalHeirCertificate !== "yes",
  },
  {
    id: "patta-transfer",
    title: "Transfer Patta / Land Records to Legal Heirs",
    office: "Village Administrative Officer (VAO) / Taluk Office / Sub-Registrar",
    documents: [
      "Legal Heir Certificate",
      "Death certificate",
      "Existing patta / chitta copy",
      "Property tax receipts",
    ],
    fee: "Varies; check with the Taluk office",
    timeline: "4-8 weeks typically",
    portalUrl: "https://eservices.tn.gov.in/",
    portalLabel: "TN Revenue Dept. e-Services",
    instructions:
      "Leaving land records in a deceased person's name creates real risk — encroachment attempts and blocked sales/loans are common. Apply for mutation promptly once you have the Legal Heir Certificate.",
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.ownedProperty === "yes",
  },
  {
    id: "property-tax-mutation",
    title: "Update Property Tax Records",
    office: "Greater Chennai Corporation (or local municipality)",
    documents: ["Legal Heir Certificate", "Patta transfer confirmation", "Latest property tax receipt"],
    fee: "Nominal admin fee",
    timeline: "2-4 weeks",
    portalUrl: "https://chennaicorporation.gov.in/",
    portalLabel: "Greater Chennai Corporation",
    instructions:
      "Do this after the patta transfer so property tax bills are issued in the new owner's name — needed for future resale or loans.",
    dependsOn: ["patta-transfer"],
    appliesIf: (a) => a.ownedProperty === "yes",
  },
  {
    id: "bank-claim",
    title: "Claim / Transfer Bank Accounts and Fixed Deposits",
    office: "Respective bank branch",
    documents: [
      "Death certificate",
      "Legal Heir Certificate (if no nominee was registered)",
      "Nominee's ID and address proof (if a nominee was registered)",
      "Passbook / account statements",
    ],
    fee: "Usually free",
    timeline: "1-4 weeks; faster if a nominee is registered",
    instructions:
      "If a nominee was registered, the process is much simpler — the bank pays out to the nominee directly with just the death certificate and ID. Without a nominee, banks usually require the Legal Heir Certificate (and for larger balances, sometimes a Succession Certificate from a civil court).",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadBankAccounts === "yes",
  },
  {
    id: "insurance-claim",
    title: "File the Life Insurance Claim",
    office: "Insurance company (e.g. LIC branch)",
    documents: [
      "Original policy document",
      "Death certificate",
      "Claim form (from insurer)",
      "Nominee/Legal Heir ID proof",
    ],
    fee: "Free to file",
    timeline: "30-90 days depending on insurer and claim type",
    portalUrl: "https://licindia.in/",
    portalLabel: "LIC (if applicable)",
    instructions:
      "Contact the insurer or agent to get the correct claim form — early or accidental death claims may need additional documents (FIR, post-mortem report).",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadInsurance === "yes",
  },
  {
    id: "epf-pension-transfer",
    title: "Claim EPF and Transfer / Claim Pension",
    office: "EPFO office or Pension Disbursing Authority (Treasury / Bank)",
    documents: [
      "Death certificate",
      "Legal Heir Certificate",
      "Family pension application form",
      "Bank account details of the claimant",
    ],
    fee: "Free",
    timeline: "4-8 weeks",
    portalUrl: "https://www.epfindia.gov.in/",
    portalLabel: "EPFO portal",
    instructions:
      "For government employees, family pension is usually processed through the same department/treasury that paid the original pension — contact them directly with the Legal Heir Certificate.",
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.hadEpfOrPension === "yes",
  },
  {
    id: "eb-name-transfer",
    title: "Transfer Electricity (TANGEDCO) Connection",
    office: "Local TANGEDCO section office",
    documents: ["Death certificate", "Legal Heir Certificate", "Latest EB bill", "Property ownership proof"],
    fee: "Nominal transfer fee",
    timeline: "1-3 weeks",
    portalUrl: "https://www.tangedco.gov.in/",
    portalLabel: "TANGEDCO",
    instructions: "Needed so future bills and any subsidy schemes are correctly attributed to the new owner.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadElectricityConnection === "yes",
  },
  {
    id: "gas-connection-transfer",
    title: "Transfer LPG Gas Connection",
    office: "Local gas agency (Indane / Bharat Gas / HP)",
    documents: ["Death certificate", "Legal Heir Certificate or family consent letter", "Existing gas passbook/ID"],
    fee: "Usually free or nominal",
    timeline: "1-2 weeks",
    instructions: "Visit or call the distributor directly — most allow transfer to a family member with a simple written request plus the death certificate.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadGasConnection === "yes",
  },
  {
    id: "vehicle-rc-transfer",
    title: "Transfer Vehicle Registration (RC)",
    office: "Regional Transport Office (RTO)",
    documents: [
      "Death certificate",
      "Legal Heir Certificate",
      "Original RC book",
      "Insurance transfer confirmation",
      "Form 31 (transfer of ownership on death)",
    ],
    fee: "RTO transfer fee (varies by vehicle type)",
    timeline: "2-4 weeks",
    portalUrl: "https://parivahan.gov.in/",
    portalLabel: "Parivahan portal",
    instructions: "Also update the vehicle insurance policy to the new owner's name at the same time.",
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.ownedVehicle === "yes",
  },
  {
    id: "pan-surrender",
    title: "Settle PAN / Final Income Tax Return",
    office: "Income Tax Department",
    documents: ["Death certificate", "Legal Heir Certificate", "Deceased's PAN card", "Last filed IT return (if any)"],
    fee: "Free",
    timeline: "Varies — align with the IT filing deadline for that year",
    portalUrl: "https://www.incometax.gov.in/",
    portalLabel: "Income Tax e-filing portal",
    instructions:
      "A legal heir can register on the income tax portal as a 'Legal Heir' for the deceased's PAN to file any pending final return. PAN itself does not need to be formally 'surrendered' in most cases — just ensure no further returns are expected.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadPan === "yes",
  },
  {
    id: "ration-card-update",
    title: "Update or Correct the Ration Card (PDS)",
    office: "Taluk Civil Supplies Office / TNPDS portal",
    documents: ["Death certificate", "Existing ration card", "Legal Heir Certificate or family member details"],
    fee: "Free",
    timeline: "2-4 weeks",
    portalUrl: "https://www.tnpds.gov.in/",
    portalLabel: "TNPDS portal",
    instructions:
      "The deceased's name needs to be removed from the family's ration card so future entitlements and subsidies are calculated correctly.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadRationCard === "yes",
  },
  {
    id: "voter-id-deletion",
    title: "Delete the Deceased's Voter ID (EPIC)",
    office: "Electoral Registration Officer (ERO) / National Voter Service Portal",
    documents: ["Death certificate", "Deceased's Voter ID (EPIC) card", "Form 7 (application for deletion)"],
    fee: "Free",
    timeline: "2-4 weeks",
    portalUrl: "https://voters.eci.gov.in/",
    portalLabel: "National Voter Service Portal",
    instructions:
      "File Form 7 online or at the local ERO office to have the deceased's entry removed from the electoral roll.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadVoterId === "yes",
  },
  {
    id: "passport-update",
    title: "Update Family Members' Passports",
    office: "Passport Seva Kendra (PSK)",
    documents: [
      "Death certificate",
      "Passport of the family member needing an update",
      "Marriage certificate (if updating a spouse's name/status)",
      "Legal Heir Certificate (if relevant)",
    ],
    fee: "Standard passport reissue/update fee applies",
    timeline: "1-3 weeks for reissue, once the appointment is scheduled",
    portalUrl: "https://www.passportindia.gov.in/",
    portalLabel: "Passport Seva",
    instructions:
      "A surviving spouse or child does not need to update their own passport immediately, but should do so if it lists the deceased as a name reference and a reissue is due for any other reason (expiry, page exhaustion).",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadPassport === "yes",
  },
  {
    id: "mutual-fund-demat-transmission",
    title: "Transfer Mutual Funds, Shares, and Demat Holdings",
    office: "Asset Management Company (AMC) / Depository Participant (broker)",
    documents: [
      "Death certificate",
      "Transmission request form (from the AMC/broker)",
      "Claimant's KYC documents and PAN",
      "Legal Heir Certificate (if no nominee was registered)",
    ],
    fee: "Usually free",
    timeline: "2-4 weeks; faster if a nominee was registered",
    instructions:
      "Contact each AMC (for mutual funds) or the broker/depository participant (for shares and demat holdings) separately — there is no single portal. If a nominee was registered, the process is much faster.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadMutualFundsOrDemat === "yes",
  },
  {
    id: "mobile-connection-transfer",
    title: "Transfer or Close the Mobile / DTH Connection",
    office: "Telecom operator's retail store or customer service",
    documents: ["Death certificate", "ID proof of the new account holder", "Existing bill or account details"],
    fee: "Usually free",
    timeline: "Same day to a few days",
    instructions:
      "Most telecom and DTH operators allow a straightforward transfer to a family member's name with the death certificate and the new holder's ID — visit a retail store or call customer care.",
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadMobileConnection === "yes",
  },
];
