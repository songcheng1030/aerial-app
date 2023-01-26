interface TypeStrings {
  long: string
  short: string
}

const typeStrings = (x: TypeStrings): TypeStrings => x

export const contentfulDocTypeMap = {
  ANNUAL_REPORT: typeStrings({
    long: 'Annual Report and Entity Tax',
    short: 'Report.pdf',
  }),
  BUSINESS_LICENSE: typeStrings({
    long: 'Business License',
    short: 'License.pdf',
  }),
  REGISTERED_AGENT: typeStrings({
    long: 'Registered Agent',
    short: 'Agent.pdf',
  }),
  TAX_ID_DOCUMENT: typeStrings({
    long: 'State and Local TAX ID Document',
    short: 'Tax ID.pdf',
  }),
  ARTICLES_OF_INCORPORATION: typeStrings({
    long: 'Articles of Incorporation',
    short: 'Articles',
  }),
  INCORPORATOR_CONSENT: typeStrings({
    long: 'Incorporator Consent',
    short: 'Incorporator.pdf',
  }),
  CORPORATE_BYLAWS: typeStrings({
    long: 'Corporate Bylaws',
    short: 'Bylaws.pdf',
  }),
  IRS_EIN_ASSIGNMENT_LETTER: typeStrings({
    long: 'IRS EIN assignment Letter',
    short: 'EIN Letter.pdf',
  }),
  LEGAL_SETTLEMENT: typeStrings({
    long: 'Legal Settlement',
    short: 'Settlement.pdf',
  }),
  CERTIFICATE_GOOD_STANDING: typeStrings({
    long: 'Certificate of Good Standing',
    short: 'Good Standing.pdf',
  }),
  OTHER_CORPORATE_FILLING: typeStrings({
    long: 'Other Corporate Filling',
    short: 'Filing.pdf', // TODO: come up with better name
  }),
  VOTING_AGREEMENT: typeStrings({
    long: 'Voting Agreement',
    short: 'Voting.pdf',
  }),
  RIGHT_OF_FIRST_REFUSAL_AND_COSALE_AGREEMENT: typeStrings({
    long: 'Right of First Refusal and Cosale Agreement',
    short: 'ROFR.pdf',
  }),
  LEGAL_OPINION: typeStrings({ long: 'Legal Opinion', short: 'Opinion.pdf' }),
  INVESTOR_RIGHTS_AGREEMENT: typeStrings({
    long: 'Investor Rights Agreement',
    short: 'Investor Right.pdf',
  }),
  SECURITIES_LAW_FILING: typeStrings({
    long: 'Securities Law Filing',
    short: 'Securities.pdf',
  }),
  PREFERRED_STOCK_PURCHASE_AGREEMENT: typeStrings({
    long: 'Preferred Stock Purchase Agreement',
    short: 'Preferred Purchase.pdf',
  }),
  SIMPLE_AGREEMENT_FOR_FUTURE_EQUITY: typeStrings({
    long: 'Simple Agreement for Future Equity',
    short: 'SAFE.pdf',
  }),
  CONVERTIBLE_NOTE: typeStrings({
    long: 'Convertible Note',
    short: 'Convertible.pdf',
  }),
  SIDE_LETTER: typeStrings({ long: 'Side Letter', short: 'Side.pdf' }),
  COMMON_STOCK_PURCHASE_AGREEMENT: typeStrings({
    long: 'Common Stock Purchase Agreement',
    short: 'Common.pdf',
  }),
  SECTION_83B_ELECTION_FORM: typeStrings({
    long: 'Section 83(B) Election Form',
    short: '83B.pdf',
  }),
  STOCK_OPTION_GRANT: typeStrings({
    long: 'Stock Option Grant',
    short: 'Option Grant.pdf',
  }),
  STOCKHOLDER_CONSENT: typeStrings({
    long: 'Stockholder Consent',
    short: 'Stockholder Consent.pdf',
  }),
  CONTRACTOR_AGREEMENT: typeStrings({
    long: 'Contractor Agreement',
    short: 'Contractor.pdf',
  }),
  ADVISOR_AGREEMENT: typeStrings({
    long: 'Advisor Agreement',
    short: 'Advisor.pdf',
  }),
  PROPRIETARY_INFORMATION_AND_INVENTION_ASSIGNMENT: typeStrings({
    long: 'Proprietary Information and Invention Assignment',
    short: 'PIIA.pdf',
  }),
  EMPLOYMENT_AGREEMENT: typeStrings({
    long: 'Employment Agreement',
    short: 'Employment.pdf',
  }),
  OFFER_LETTER: typeStrings({ long: 'Offer Letter', short: 'Offer.pdf' }),
  INDEMNIFICATION_AGREEMENT: typeStrings({
    long: 'Indemnification Agreement',
    short: 'Indemnification.pdf',
  }),
  BOARD_CONSENT_AND_MINUTES: typeStrings({
    long: 'Board Consent and Minutes',
    short: 'Board Consent.pdf',
  }),
  _409A_REPORT: typeStrings({
    long: '409(A) Valuation report',
    short: '409A.pdf',
  }),
  STOCK_OPTION_PLAN: typeStrings({
    long: 'Stock Option Plan',
    short: 'Option Plan.pdf',
  }),
  PRO_FORMA_CAP_TABLE: typeStrings({
    long: 'Pro-forma Cap Table',
    short: 'Cap Table.pdf',
  }),

  // Insurance
  CERTIFICATE_OF_INSURANCE: typeStrings({
    long: 'Certificate of Insurance',
    short: 'COI.pdf',
  }),
  INSURANCE_AGREEMENT: typeStrings({
    long: 'Insurance Agreement',
    short: 'Insurance.pdf',
  }),
  OTHER_INSURANCE_DOCUMENT: typeStrings({
    long: 'Other Insurance Document',
    short: 'Other Insurance.pdf',
  }),

  // Intellectual property
  PATENT: typeStrings({ long: 'Patent Filing', short: 'Patent.pdf' }),
  TRADEMARK: typeStrings({ long: 'Trademark Filing', short: 'Trademark.pdf' }),
  COPYRIGHT: typeStrings({ long: 'Copyright Filing', short: 'Copyright.pdf' }),

  // Debt
  DEBT_AGREEMENT: typeStrings({ long: 'Debt Agreement', short: 'Debt.pdf' }),

  // Benefit Plans
  _401K_PLAN: typeStrings({ long: '401(K) Plan', short: '401K.pdf' }),
  EMPLOYEE_HANDBOOK: typeStrings({
    long: 'Employee Handbook',
    short: 'Handbook.pdf',
  }),
  COMMUTER_BENEFIT_AGREEMENT: typeStrings({
    long: 'Commuter Benefit Agreement',
    short: 'Commuter.pdf',
  }),
  HEALTH_INSURANCE_AGREEMENT: typeStrings({
    long: 'Health Insurance Agreement',
    short: 'Health.pdf',
  }),
  DENTAL_PLAN_AGREEMENT: typeStrings({
    long: 'Dental Plan Agreement',
    short: 'Dental.pdf',
  }),
  VISION_PLAN_AGREEMENT: typeStrings({
    long: 'Vision Plan Agreement',
    short: 'Vision.pdf',
  }),

  // Real Estate
  REAL_ESTATE_LEASE: typeStrings({
    long: 'Real Estate Lease',
    short: 'RE Lease.pdf',
  }),
  PURCHASED_REAL_ESTATE: typeStrings({
    long: 'Real Estate Purchase Agreement.pdf',
    short: 'RE Purchase.pdf',
  }),

  // Financials
  AUDITOR_LETTER: typeStrings({ long: 'Auditor Letter', short: 'Auditor.pdf' }),
  INCOME_STATEMENT: typeStrings({
    long: 'Income Statement',
    short: 'Income.pdf',
  }),
  BALANCE_SHEET: typeStrings({ long: 'Balance Sheet', short: 'Balance.pdf' }),
  OTHER_FINANCIAL_STATEMENTS: typeStrings({
    long: 'Other Financial Statements',
    short: 'Other Financials.pdf',
  }),

  // Customer
  CUSTOMER_AGREEMENT: typeStrings({
    long: 'Customer Agreement',
    short: 'Customer.pdf',
  }),

  // Vendor Agreement
  VENDOR_AGREEMENT: typeStrings({
    long: 'Vendor Agreement',
    short: 'Vendor.pdf',
  }),

  // Other documents
  // PARTNERSHIP_AGREEMENT: typeStrings({ long: 'Partnership Agreement' }),
  // JOINT_VENTURES_AGREEMENT: typeStrings({ long: 'Joint Ventures Agreement' }),
  // LETTER_OF_INTENT: typeStrings({ long: 'Letter of Intent' }),
  // VENDOR_AGREEMENT: typeStrings({ long: 'Vendor Agreement' }),
  // EQUIPMENT_LEASE: typeStrings({ long: 'Equipment Lease' }),
  // LICENSING_AGREEMENT: typeStrings({ long: 'Licensing Agreement' }),
  // NON_DISCLOSURE_AGREEMENT: typeStrings({ long: 'Non-disclosure Agreement' }),

  // PRIVACY_POLICY: typeStrings({ long: 'Privacy Policy' }),
  // TERMS_OF_SERVICE: typeStrings({ long: 'Terms of Service' }),
  // MASTER_SERVICES_AGREEMENT: typeStrings({ long: 'Master Services Agreement' }),
  // STATEMENT_OF_WORK: typeStrings({ long: 'Statement of Work' }),
  // MATERIALS_SENT_TO_BOARD: typeStrings({ long: 'Materials sent to board' }),
  // NON_COMPETE_RESTRICTION: typeStrings({ long: 'Non-compete restriction' }),
  // COMPANY_TEMPLATE_LEGAL_AGREEMENT: typeStrings({
  //   long: 'Company Template Legal Agreement',
  // }),
  MISCELLANEOUS: typeStrings({ long: 'Miscellaneous', short: 'Misc.pdf' }),
} as const
export const contentfulDocTypes = Object.keys(contentfulDocTypeMap) as ContentfulDocType[]
type ContentfulDocType = keyof typeof contentfulDocTypeMap

export const contentlessDocTypeMap = {
  UNCATEGORIZED: typeStrings({
    long: 'Uncategorized',
    short: 'Uncategorized.pdf',
  }),
  PROCESSING: typeStrings({ long: 'Processing', short: 'Processing.pdf' }),
  DISMISSED: typeStrings({ long: 'Dismissed', short: 'Dismissed.pdf' }),
} as const
export const contentlessDocTypes = Object.keys(contentlessDocTypeMap) as ContentlessDocType[]
type ContentlessDocType = keyof typeof contentlessDocTypeMap

export const docTypeMap = {
  ...contentfulDocTypeMap,
  ...contentlessDocTypeMap,
} as const
export const docTypes = Object.keys(docTypeMap) as DocType[]
type DocType = keyof typeof docTypeMap

export const docTypeStr = (type: DocType, short?: boolean) =>
  short ? docTypeMap[type].short : docTypeMap[type].long
