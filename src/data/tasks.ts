import type { Answers } from "./intakeQuestions";
import type { LocalizedText } from "@/i18n/types";

export interface Task {
  id: string;
  title: LocalizedText;
  office: LocalizedText;
  documents: LocalizedText[];
  fee: LocalizedText;
  timeline: LocalizedText;
  portalUrl?: string;
  portalLabel?: LocalizedText;
  instructions: LocalizedText;
  /** Task ids that must be completed before this one is actionable. */
  dependsOn: string[];
  /** Whether this task applies given the user's intake answers. */
  appliesIf: (answers: Answers) => boolean;
}

export const tasks: Task[] = [
  {
    id: "death-certificate",
    title: {
      en: "Obtain the Death Certificate",
      ta: "இறப்புச் சான்றிதழைப் பெறுதல்",
    },
    office: {
      en: "Local Municipality / Greater Chennai Corporation (Registrar of Births & Deaths)",
      ta: "உள்ளூர் நகராட்சி / சென்னை மாநகராட்சி (பிறப்பு-இறப்பு பதிவாளர்)",
    },
    documents: [
      { en: "Hospital death intimation (if death occurred in hospital)", ta: "மருத்துவமனை இறப்பு அறிவிப்பு (மருத்துவமனையில் இறப்பு நிகழ்ந்திருந்தால்)" },
      { en: "Applicant ID proof", ta: "விண்ணப்பதாரரின் அடையாள ஆதாரம்" },
      { en: "Address proof of the deceased", ta: "இறந்தவரின் முகவரி ஆதாரம்" },
    ],
    fee: {
      en: "Free for the first copy within 21 days; small fee for delayed registration or extra copies",
      ta: "21 நாட்களுக்குள் முதல் நகல் இலவசம்; தாமதமான பதிவு அல்லது கூடுதல் நகல்களுக்கு சிறிய கட்டணம்",
    },
    timeline: {
      en: "Same day to a few days if registered promptly",
      ta: "உடனடியாக பதிவு செய்தால் அன்றே முதல் சில நாட்கள் வரை",
    },
    portalUrl: "https://tnreginet.gov.in/",
    portalLabel: { en: "TN Registration Dept. / e-Sevai", ta: "தமிழ்நாடு பதிவுத் துறை / இ-சேவை" },
    instructions: {
      en: "Request at least 8-10 certified copies — you will need to submit an original or attested copy for almost every task below (bank, insurance, EB, gas, RTO, pension).",
      ta: "குறைந்தது 8-10 சான்றளிக்கப்பட்ட நகல்களைக் கோரவும் — கீழே உள்ள கிட்டத்தட்ட ஒவ்வொரு பணிக்கும் (வங்கி, காப்பீடு, மின்சாரம், எரிவாயு, RTO, ஓய்வூதியம்) மூல அல்லது சான்றளிக்கப்பட்ட நகல் தேவைப்படும்.",
    },
    dependsOn: [],
    appliesIf: (a) => a.deathCertificate !== "yes",
  },
  {
    id: "legal-heir-certificate",
    title: {
      en: "Get the Legal Heir (Varisu) Certificate",
      ta: "வாரிசுச் சான்றிதழைப் பெறுதல்",
    },
    office: {
      en: "Taluk Tahsildar's Office / TN e-Sevai portal",
      ta: "வட்டாட்சியர் அலுவலகம் / தமிழ்நாடு இ-சேவை போர்டல்",
    },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Applicant ID proof (Aadhaar / Voter ID)", ta: "விண்ணப்பதாரரின் அடையாள ஆதாரம் (ஆதார் / வாக்காளர் அட்டை)" },
      { en: "Address proof", ta: "முகவரி ஆதாரம்" },
      { en: "Proof of relationship to the deceased", ta: "இறந்தவருடனான உறவுச் சான்று" },
      { en: "Self-undertaking affidavit", ta: "சுய உறுதிமொழிப் பத்திரம் (Affidavit)" },
    ],
    fee: { en: "Nominal fee, varies by taluk", ta: "சிறிய கட்டணம், வட்டத்திற்கு வட்டம் மாறுபடும்" },
    timeline: { en: "15-30 days", ta: "15-30 நாட்கள்" },
    portalUrl: "https://www.tnesevai.tn.gov.in/",
    portalLabel: { en: "TN e-Sevai portal", ta: "தமிழ்நாடு இ-சேவை போர்டல்" },
    instructions: {
      en: "This is the foundational document — almost every claim (property, bank, pension, vehicle) will ask for it. Apply as early as possible since it typically takes the longest.",
      ta: "இது அடிப்படை ஆவணம் — கிட்டத்தட்ட ஒவ்வொரு உரிமைகோரலுக்கும் (சொத்து, வங்கி, ஓய்வூதியம், வாகனம்) இது தேவைப்படும். இது பொதுவாக அதிக நேரம் எடுப்பதால், முடிந்தவரை விரைவில் விண்ணப்பிக்கவும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.legalHeirCertificate !== "yes",
  },
  {
    id: "patta-transfer",
    title: {
      en: "Transfer Patta / Land Records to Legal Heirs",
      ta: "பட்டா / நில ஆவணங்களை வாரிசுகள் பெயருக்கு மாற்றுதல்",
    },
    office: {
      en: "Village Administrative Officer (VAO) / Taluk Office / Sub-Registrar",
      ta: "கிராம நிர்வாக அலுவலர் (VAO) / வட்டாட்சியர் அலுவலகம் / சார்பதிவாளர்",
    },
    documents: [
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Existing patta / chitta copy", ta: "தற்போதைய பட்டா / சிட்டா நகல்" },
      { en: "Property tax receipts", ta: "சொத்து வரி ரசீதுகள்" },
    ],
    fee: { en: "Varies; check with the Taluk office", ta: "மாறுபடும்; வட்டாட்சியர் அலுவலகத்தில் உறுதி செய்யவும்" },
    timeline: { en: "4-8 weeks typically", ta: "பொதுவாக 4-8 வாரங்கள்" },
    portalUrl: "https://eservices.tn.gov.in/",
    portalLabel: { en: "TN Revenue Dept. e-Services", ta: "தமிழ்நாடு வருவாய்த் துறை இ-சேவைகள்" },
    instructions: {
      en: "Leaving land records in a deceased person's name creates real risk — encroachment attempts and blocked sales/loans are common. Apply for mutation promptly once you have the Legal Heir Certificate.",
      ta: "நில ஆவணங்களை இறந்தவரின் பெயரில் விட்டுவைப்பது உண்மையான ஆபத்தை உருவாக்கும் — ஆக்கிரமிப்பு முயற்சிகளும், விற்பனை/கடன் தடைகளும் பொதுவானவை. வாரிசுச் சான்றிதழ் கிடைத்தவுடன் உடனடியாக பெயர் மாற்றத்திற்கு விண்ணப்பிக்கவும்.",
    },
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.ownedProperty === "yes",
  },
  {
    id: "property-tax-mutation",
    title: {
      en: "Update Property Tax Records",
      ta: "சொத்து வரி ஆவணங்களைப் புதுப்பித்தல்",
    },
    office: {
      en: "Greater Chennai Corporation (or local municipality)",
      ta: "சென்னை மாநகராட்சி (அல்லது உள்ளூர் நகராட்சி)",
    },
    documents: [
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Patta transfer confirmation", ta: "பட்டா மாற்றம் உறுதிப்படுத்தல்" },
      { en: "Latest property tax receipt", ta: "சமீபத்திய சொத்து வரி ரசீது" },
    ],
    fee: { en: "Nominal admin fee", ta: "சிறிய நிர்வாகக் கட்டணம்" },
    timeline: { en: "2-4 weeks", ta: "2-4 வாரங்கள்" },
    portalUrl: "https://chennaicorporation.gov.in/",
    portalLabel: { en: "Greater Chennai Corporation", ta: "சென்னை மாநகராட்சி" },
    instructions: {
      en: "Do this after the patta transfer so property tax bills are issued in the new owner's name — needed for future resale or loans.",
      ta: "பட்டா மாற்றத்திற்குப் பிறகு இதைச் செய்யவும், இதனால் சொத்து வரி பில்கள் புதிய உரிமையாளரின் பெயரில் வழங்கப்படும் — எதிர்கால மறுவிற்பனை அல்லது கடன்களுக்கு இது தேவை.",
    },
    dependsOn: ["patta-transfer"],
    appliesIf: (a) => a.ownedProperty === "yes",
  },
  {
    id: "bank-claim",
    title: {
      en: "Claim / Transfer Bank Accounts and Fixed Deposits",
      ta: "வங்கிக் கணக்குகள் மற்றும் நிலையான வைப்புகளை உரிமைகோருதல் / மாற்றுதல்",
    },
    office: { en: "Respective bank branch", ta: "சம்பந்தப்பட்ட வங்கிக் கிளை" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate (if no nominee was registered)", ta: "வாரிசுச் சான்றிதழ் (நியமிதர் பதிவு செய்யப்படாவிட்டால்)" },
      { en: "Nominee's ID and address proof (if a nominee was registered)", ta: "நியமிதரின் அடையாள மற்றும் முகவரி ஆதாரம் (நியமிதர் பதிவு செய்யப்பட்டிருந்தால்)" },
      { en: "Passbook / account statements", ta: "பாஸ்புக் / கணக்கு அறிக்கைகள்" },
    ],
    fee: { en: "Usually free", ta: "பொதுவாக இலவசம்" },
    timeline: { en: "1-4 weeks; faster if a nominee is registered", ta: "1-4 வாரங்கள்; நியமிதர் பதிவு செய்யப்பட்டிருந்தால் வேகமாக முடியும்" },
    instructions: {
      en: "If a nominee was registered, the process is much simpler — the bank pays out to the nominee directly with just the death certificate and ID. Without a nominee, banks usually require the Legal Heir Certificate (and for larger balances, sometimes a Succession Certificate from a civil court).",
      ta: "நியமிதர் பதிவு செய்யப்பட்டிருந்தால், செயல்முறை மிகவும் எளிதானது — இறப்புச் சான்றிதழ் மற்றும் அடையாள ஆதாரத்துடன் வங்கி நேரடியாக நியமிதருக்கு தொகையை வழங்கும். நியமிதர் இல்லாத பட்சத்தில், வங்கிகள் பொதுவாக வாரிசுச் சான்றிதழைக் கோரும் (அதிக தொகைக்கு, சில நேரங்களில் சிவில் நீதிமன்றத்தில் இருந்து வாரிசு உரிமைச் சான்றிதழ் தேவைப்படலாம்).",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadBankAccounts === "yes",
  },
  {
    id: "insurance-claim",
    title: {
      en: "File the Life Insurance Claim",
      ta: "ஆயுள் காப்பீட்டு உரிமைகோரலைத் தாக்கல் செய்தல்",
    },
    office: { en: "Insurance company (e.g. LIC branch)", ta: "காப்பீட்டு நிறுவனம் (எ.கா. LIC கிளை)" },
    documents: [
      { en: "Original policy document", ta: "அசல் பாலிசி ஆவணம்" },
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Claim form (from insurer)", ta: "உரிமைகோரல் படிவம் (காப்பீட்டாளரிடமிருந்து)" },
      { en: "Nominee/Legal Heir ID proof", ta: "நியமிதர்/வாரிசு அடையாள ஆதாரம்" },
    ],
    fee: { en: "Free to file", ta: "தாக்கல் செய்ய இலவசம்" },
    timeline: { en: "30-90 days depending on insurer and claim type", ta: "காப்பீட்டாளர் மற்றும் உரிமைகோரல் வகையைப் பொறுத்து 30-90 நாட்கள்" },
    portalUrl: "https://licindia.in/",
    portalLabel: { en: "LIC (if applicable)", ta: "LIC (பொருந்தினால்)" },
    instructions: {
      en: "Contact the insurer or agent to get the correct claim form — early or accidental death claims may need additional documents (FIR, post-mortem report).",
      ta: "சரியான உரிமைகோரல் படிவத்தைப் பெற காப்பீட்டாளர் அல்லது முகவரைத் தொடர்பு கொள்ளவும் — முன்கூட்டிய அல்லது விபத்து இறப்பு உரிமைகோரல்களுக்கு கூடுதல் ஆவணங்கள் (FIR, பிரேத பரிசோதனை அறிக்கை) தேவைப்படலாம்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadInsurance === "yes",
  },
  {
    id: "epf-pension-transfer",
    title: {
      en: "Claim EPF and Transfer / Claim Pension",
      ta: "EPF உரிமைகோரல் மற்றும் ஓய்வூதிய மாற்றம் / உரிமைகோரல்",
    },
    office: {
      en: "EPFO office or Pension Disbursing Authority (Treasury / Bank)",
      ta: "EPFO அலுவலகம் அல்லது ஓய்வூதியம் வழங்கும் அதிகாரம் (கருவூலம் / வங்கி)",
    },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Family pension application form", ta: "குடும்ப ஓய்வூதிய விண்ணப்பப் படிவம்" },
      { en: "Bank account details of the claimant", ta: "உரிமைகோரலாளரின் வங்கிக் கணக்கு விவரங்கள்" },
    ],
    fee: { en: "Free", ta: "இலவசம்" },
    timeline: { en: "4-8 weeks", ta: "4-8 வாரங்கள்" },
    portalUrl: "https://www.epfindia.gov.in/",
    portalLabel: { en: "EPFO portal", ta: "EPFO போர்டல்" },
    instructions: {
      en: "For government employees, family pension is usually processed through the same department/treasury that paid the original pension — contact them directly with the Legal Heir Certificate.",
      ta: "அரசு ஊழியர்களுக்கு, குடும்ப ஓய்வூதியம் பொதுவாக அசல் ஓய்வூதியம் வழங்கிய அதே துறை/கருவூலம் மூலம் செயலாக்கப்படும் — வாரிசுச் சான்றிதழுடன் அவர்களை நேரடியாகத் தொடர்பு கொள்ளவும்.",
    },
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.hadEpfOrPension === "yes",
  },
  {
    id: "eb-name-transfer",
    title: {
      en: "Transfer Electricity (TANGEDCO) Connection",
      ta: "மின்சார (TANGEDCO) இணைப்பை மாற்றுதல்",
    },
    office: { en: "Local TANGEDCO section office", ta: "உள்ளூர் TANGEDCO பிரிவு அலுவலகம்" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Latest EB bill", ta: "சமீபத்திய மின்சார பில்" },
      { en: "Property ownership proof", ta: "சொத்து உரிமை ஆதாரம்" },
    ],
    fee: { en: "Nominal transfer fee", ta: "சிறிய மாற்றக் கட்டணம்" },
    timeline: { en: "1-3 weeks", ta: "1-3 வாரங்கள்" },
    portalUrl: "https://www.tangedco.gov.in/",
    portalLabel: { en: "TANGEDCO", ta: "TANGEDCO" },
    instructions: {
      en: "Needed so future bills and any subsidy schemes are correctly attributed to the new owner.",
      ta: "எதிர்கால பில்களும், மானியத் திட்டங்களும் புதிய உரிமையாளர் பெயரில் சரியாகப் பதிவாக இது தேவை.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadElectricityConnection === "yes",
  },
  {
    id: "gas-connection-transfer",
    title: {
      en: "Transfer LPG Gas Connection",
      ta: "எல்பிஜி எரிவாயு இணைப்பை மாற்றுதல்",
    },
    office: { en: "Local gas agency (Indane / Bharat Gas / HP)", ta: "உள்ளூர் எரிவாயு நிறுவனம் (இந்தேன் / பாரத் கேஸ் / HP)" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate or family consent letter", ta: "வாரிசுச் சான்றிதழ் அல்லது குடும்ப ஒப்புதல் கடிதம்" },
      { en: "Existing gas passbook/ID", ta: "தற்போதைய எரிவாயு பாஸ்புக்/அடையாள அட்டை" },
    ],
    fee: { en: "Usually free or nominal", ta: "பொதுவாக இலவசம் அல்லது சிறிய கட்டணம்" },
    timeline: { en: "1-2 weeks", ta: "1-2 வாரங்கள்" },
    instructions: {
      en: "Visit or call the distributor directly — most allow transfer to a family member with a simple written request plus the death certificate.",
      ta: "விநியோகஸ்தரை நேரடியாக அணுகவும் அல்லது அழைக்கவும் — பெரும்பாலானவை ஒரு எளிய எழுத்துப்பூர்வ கோரிக்கை மற்றும் இறப்புச் சான்றிதழுடன் குடும்ப உறுப்பினருக்கு மாற்ற அனுமதிக்கும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadGasConnection === "yes",
  },
  {
    id: "vehicle-rc-transfer",
    title: {
      en: "Transfer Vehicle Registration (RC)",
      ta: "வாகனப் பதிவை (RC) மாற்றுதல்",
    },
    office: { en: "Regional Transport Office (RTO)", ta: "பிராந்திய போக்குவரத்து அலுவலகம் (RTO)" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Original RC book", ta: "அசல் RC புத்தகம்" },
      { en: "Insurance transfer confirmation", ta: "காப்பீடு மாற்றம் உறுதிப்படுத்தல்" },
      { en: "Form 31 (transfer of ownership on death)", ta: "படிவம் 31 (இறப்பின் போது உரிமை மாற்றம்)" },
    ],
    fee: { en: "RTO transfer fee (varies by vehicle type)", ta: "RTO மாற்றக் கட்டணம் (வாகன வகையைப் பொறுத்து மாறுபடும்)" },
    timeline: { en: "2-4 weeks", ta: "2-4 வாரங்கள்" },
    portalUrl: "https://parivahan.gov.in/",
    portalLabel: { en: "Parivahan portal", ta: "பரிவாகன் போர்டல்" },
    instructions: {
      en: "Also update the vehicle insurance policy to the new owner's name at the same time.",
      ta: "அதே நேரத்தில் வாகனக் காப்பீட்டு பாலிசியையும் புதிய உரிமையாளர் பெயருக்கு புதுப்பிக்கவும்.",
    },
    dependsOn: ["legal-heir-certificate"],
    appliesIf: (a) => a.ownedVehicle === "yes",
  },
  {
    id: "pan-surrender",
    title: {
      en: "Settle PAN / Final Income Tax Return",
      ta: "பான் / இறுதி வருமான வரி கோப்பை முடித்தல்",
    },
    office: { en: "Income Tax Department", ta: "வருமான வரித் துறை" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Legal Heir Certificate", ta: "வாரிசுச் சான்றிதழ்" },
      { en: "Deceased's PAN card", ta: "இறந்தவரின் பான் அட்டை" },
      { en: "Last filed IT return (if any)", ta: "கடைசியாக தாக்கல் செய்யப்பட்ட வரி கோப்பு (இருந்தால்)" },
    ],
    fee: { en: "Free", ta: "இலவசம்" },
    timeline: { en: "Varies — align with the IT filing deadline for that year", ta: "மாறுபடும் — அந்த ஆண்டு வரி தாக்கல் காலக்கெடுவுடன் பொருந்தும்படி செய்யவும்" },
    portalUrl: "https://www.incometax.gov.in/",
    portalLabel: { en: "Income Tax e-filing portal", ta: "வருமான வரி இ-தாக்கல் போர்டல்" },
    instructions: {
      en: "A legal heir can register on the income tax portal as a 'Legal Heir' for the deceased's PAN to file any pending final return. PAN itself does not need to be formally 'surrendered' in most cases — just ensure no further returns are expected.",
      ta: "நிலுவையிலுள்ள இறுதி வரி கோப்பைத் தாக்கல் செய்ய, வாரிசு ஒருவர் வருமான வரி போர்டலில் இறந்தவரின் பான் எண்ணுக்கு 'வாரிசு'ஆக பதிவு செய்யலாம். பெரும்பாலான சந்தர்ப்பங்களில் பான் அட்டையை முறையாக 'சரண்டர்' செய்ய தேவையில்லை — மேலும் வரி கோப்புகள் எதுவும் எதிர்பார்க்கப்படவில்லை என்பதை உறுதி செய்யவும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadPan === "yes",
  },
  {
    id: "ration-card-update",
    title: {
      en: "Update or Correct the Ration Card (PDS)",
      ta: "குடும்ப அட்டையை (ரேஷன் கார்டு) புதுப்பித்தல் / திருத்துதல்",
    },
    office: { en: "Taluk Civil Supplies Office / TNPDS portal", ta: "வட்ட உபகுடிமராமத்துத் துறை அலுவலகம் / TNPDS போர்டல்" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Existing ration card", ta: "தற்போதைய குடும்ப அட்டை" },
      { en: "Legal Heir Certificate or family member details", ta: "வாரிசுச் சான்றிதழ் அல்லது குடும்ப உறுப்பினர் விவரங்கள்" },
    ],
    fee: { en: "Free", ta: "இலவசம்" },
    timeline: { en: "2-4 weeks", ta: "2-4 வாரங்கள்" },
    portalUrl: "https://www.tnpds.gov.in/",
    portalLabel: { en: "TNPDS portal", ta: "TNPDS போர்டல்" },
    instructions: {
      en: "The deceased's name needs to be removed from the family's ration card so future entitlements and subsidies are calculated correctly.",
      ta: "எதிர்கால உரிமைகளும் மானியங்களும் சரியாகக் கணக்கிடப்பட, குடும்ப அட்டையிலிருந்து இறந்தவரின் பெயர் நீக்கப்பட வேண்டும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadRationCard === "yes",
  },
  {
    id: "voter-id-deletion",
    title: {
      en: "Delete the Deceased's Voter ID (EPIC)",
      ta: "இறந்தவரின் வாக்காளர் அடையாள அட்டையை (EPIC) நீக்குதல்",
    },
    office: {
      en: "Electoral Registration Officer (ERO) / National Voter Service Portal",
      ta: "தேர்தல் பதிவு அலுவலர் (ERO) / தேசிய வாக்காளர் சேவை போர்டல்",
    },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Deceased's Voter ID (EPIC) card", ta: "இறந்தவரின் வாக்காளர் அடையாள அட்டை (EPIC)" },
      { en: "Form 7 (application for deletion)", ta: "படிவம் 7 (நீக்கத்திற்கான விண்ணப்பம்)" },
    ],
    fee: { en: "Free", ta: "இலவசம்" },
    timeline: { en: "2-4 weeks", ta: "2-4 வாரங்கள்" },
    portalUrl: "https://voters.eci.gov.in/",
    portalLabel: { en: "National Voter Service Portal", ta: "தேசிய வாக்காளர் சேவை போர்டல்" },
    instructions: {
      en: "File Form 7 online or at the local ERO office to have the deceased's entry removed from the electoral roll.",
      ta: "இறந்தவரின் பெயரை வாக்காளர் பட்டியலிலிருந்து நீக்க, படிவம் 7-ஐ ஆன்லைனில் அல்லது உள்ளூர் ERO அலுவலகத்தில் தாக்கல் செய்யவும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadVoterId === "yes",
  },
  {
    id: "passport-update",
    title: {
      en: "Update Family Members' Passports",
      ta: "குடும்ப உறுப்பினர்களின் கடவுச்சீட்டுகளைப் புதுப்பித்தல்",
    },
    office: { en: "Passport Seva Kendra (PSK)", ta: "பாஸ்போர்ட் சேவா கேந்திரா (PSK)" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Passport of the family member needing an update", ta: "புதுப்பிப்பு தேவைப்படும் குடும்ப உறுப்பினரின் கடவுச்சீட்டு" },
      { en: "Marriage certificate (if updating a spouse's name/status)", ta: "திருமணச் சான்றிதழ் (மனைவியின் பெயர்/நிலையைப் புதுப்பித்தால்)" },
      { en: "Legal Heir Certificate (if relevant)", ta: "வாரிசுச் சான்றிதழ் (பொருந்தினால்)" },
    ],
    fee: { en: "Standard passport reissue/update fee applies", ta: "வழக்கமான கடவுச்சீட்டு மறு வழங்கல்/புதுப்பிப்புக் கட்டணம் பொருந்தும்" },
    timeline: { en: "1-3 weeks for reissue, once the appointment is scheduled", ta: "சந்திப்பு நேரம் திட்டமிடப்பட்டவுடன், மறு வழங்கலுக்கு 1-3 வாரங்கள்" },
    portalUrl: "https://www.passportindia.gov.in/",
    portalLabel: { en: "Passport Seva", ta: "பாஸ்போர்ட் சேவா" },
    instructions: {
      en: "A surviving spouse or child does not need to update their own passport immediately, but should do so if it lists the deceased as a name reference and a reissue is due for any other reason (expiry, page exhaustion).",
      ta: "வாழும் மனைவி அல்லது குழந்தை உடனடியாக தங்கள் சொந்த கடவுச்சீட்டைப் புதுப்பிக்க வேண்டியதில்லை, ஆனால் அதில் இறந்தவர் பெயர் குறிப்பாக இருந்து, வேறு காரணத்திற்காக (காலாவதி, பக்கங்கள் தீர்ந்துவிட்டால்) மறு வழங்கல் தேவைப்பட்டால் இதைச் செய்யவும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadPassport === "yes",
  },
  {
    id: "mutual-fund-demat-transmission",
    title: {
      en: "Transfer Mutual Funds, Shares, and Demat Holdings",
      ta: "பரஸ்பர நிதி, பங்குகள் மற்றும் டீமேட் இருப்புகளை மாற்றுதல்",
    },
    office: {
      en: "Asset Management Company (AMC) / Depository Participant (broker)",
      ta: "சொத்து மேலாண்மை நிறுவனம் (AMC) / டெபாசிட்டரி பங்குதாரர் (பிரோக்கர்)",
    },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "Transmission request form (from the AMC/broker)", ta: "இடமாற்றக் கோரிக்கைப் படிவம் (AMC/பிரோக்கரிடமிருந்து)" },
      { en: "Claimant's KYC documents and PAN", ta: "உரிமைகோரலாளரின் KYC ஆவணங்கள் மற்றும் பான்" },
      { en: "Legal Heir Certificate (if no nominee was registered)", ta: "வாரிசுச் சான்றிதழ் (நியமிதர் பதிவு செய்யப்படாவிட்டால்)" },
    ],
    fee: { en: "Usually free", ta: "பொதுவாக இலவசம்" },
    timeline: { en: "2-4 weeks; faster if a nominee was registered", ta: "2-4 வாரங்கள்; நியமிதர் பதிவு செய்யப்பட்டிருந்தால் வேகமாக முடியும்" },
    instructions: {
      en: "Contact each AMC (for mutual funds) or the broker/depository participant (for shares and demat holdings) separately — there is no single portal. If a nominee was registered, the process is much faster.",
      ta: "ஒவ்வொரு AMC-ஐயும் (பரஸ்பர நிதிக்கு) அல்லது பிரோக்கர்/டெபாசிட்டரி பங்குதாரரையும் (பங்குகள் மற்றும் டீமேட்டுக்கு) தனித்தனியாக தொடர்பு கொள்ளவும் — ஒரே ஒரு போர்டல் இல்லை. நியமிதர் பதிவு செய்யப்பட்டிருந்தால், செயல்முறை மிக வேகமாக இருக்கும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadMutualFundsOrDemat === "yes",
  },
  {
    id: "mobile-connection-transfer",
    title: {
      en: "Transfer or Close the Mobile / DTH Connection",
      ta: "மொபைல் / டிடிஎச் இணைப்பை மாற்றுதல் அல்லது நிறுத்துதல்",
    },
    office: { en: "Telecom operator's retail store or customer service", ta: "தொலைத்தொடர்பு நிறுவனத்தின் விற்பனை நிலையம் அல்லது வாடிக்கையாளர் சேவை" },
    documents: [
      { en: "Death certificate", ta: "இறப்புச் சான்றிதழ்" },
      { en: "ID proof of the new account holder", ta: "புதிய கணக்குதாரரின் அடையாள ஆதாரம்" },
      { en: "Existing bill or account details", ta: "தற்போதைய பில் அல்லது கணக்கு விவரங்கள்" },
    ],
    fee: { en: "Usually free", ta: "பொதுவாக இலவசம்" },
    timeline: { en: "Same day to a few days", ta: "அன்றே முதல் சில நாட்கள் வரை" },
    instructions: {
      en: "Most telecom and DTH operators allow a straightforward transfer to a family member's name with the death certificate and the new holder's ID — visit a retail store or call customer care.",
      ta: "பெரும்பாலான தொலைத்தொடர்பு மற்றும் டிடிஎச் நிறுவனங்கள், இறப்புச் சான்றிதழ் மற்றும் புதிய உரிமையாளரின் அடையாள ஆதாரத்துடன் குடும்ப உறுப்பினர் பெயருக்கு எளிதாக மாற்ற அனுமதிக்கும் — விற்பனை நிலையத்திற்குச் செல்லவும் அல்லது வாடிக்கையாளர் சேவையை அழைக்கவும்.",
    },
    dependsOn: ["death-certificate"],
    appliesIf: (a) => a.hadMobileConnection === "yes",
  },
];
