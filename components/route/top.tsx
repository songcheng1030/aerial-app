import { PrimaryDocuments, StateLocalComp, Summary } from '../corporate'
import { DocView } from '../doc'
import { CapTableComp, FundraisingComp, StockOptionPlanComp, ValuationComp } from '../equity'
import { Processing } from '../other'
import { AdvisorComp, ContractorComp, DirectorComp, EmployeeComp, OfficerComp } from '../personnel'
import { NoDocs } from '../util'
import { _RouteData } from './base'

const topRouteData = [
  new _RouteData('customer', 'Customer', <DocView query={{ type: 'CUSTOMER_AGREEMENT' }} />),
  new _RouteData('vendor', 'Vendor', <DocView query={{ type: 'VENDOR_AGREEMENT' }} />),
  new _RouteData('patent', 'Patent', <DocView query={{ type: 'PATENT' }} />),
  new _RouteData('copyright', 'Copyright', <DocView query={{ type: 'COPYRIGHT' }} />),
  new _RouteData('trademark', 'Trademark', <DocView query={{ type: 'TRADEMARK' }} />),
  new _RouteData(
    'financials',
    'Financials',
    (
      <DocView
        query={{
          type: [
            'AUDITOR_LETTER',
            'INCOME_STATEMENT',
            'BALANCE_SHEET',
            'OTHER_FINANCIAL_STATEMENTS',
          ],
        }}
      />
    )
  ),
  new _RouteData('tax', 'Tax', <NoDocs />),
  new _RouteData('debt', 'Debt', <NoDocs />),
  new _RouteData('cap-table', 'Cap Table', <CapTableComp />),
  new _RouteData('stock-option-plan', 'Stock Option Plan', <StockOptionPlanComp />),
  new _RouteData('fundraising', 'Fundraising Rounds', <FundraisingComp />),
  new _RouteData('valuation', 'Valuation', <ValuationComp />),
  new _RouteData('employee', 'Employee', <EmployeeComp />),
  new _RouteData('officer', 'Officer', <OfficerComp />),
  new _RouteData('director', 'Director', <DirectorComp />),
  new _RouteData('contractor', 'Contractor', <ContractorComp />),
  new _RouteData('advisor', 'Advisor', <AdvisorComp />),
  new _RouteData('summary', 'Summary', <Summary />),
  new _RouteData('primary-documents', 'Primary Documents', <PrimaryDocuments />),
  new _RouteData('state-and-local', 'State and Local', <StateLocalComp />),
  new _RouteData(
    'insurance',
    'Insurance',
    (
      <DocView
        query={{
          type: ['CERTIFICATE_OF_INSURANCE', 'INSURANCE_AGREEMENT', 'OTHER_INSURANCE_DOCUMENT'],
        }}
      />
    )
  ),
  new _RouteData(
    'real-estate',
    'Real Estate',
    <DocView query={{ type: ['REAL_ESTATE_LEASE', 'PURCHASED_REAL_ESTATE'] }} />
  ),
  new _RouteData('miscellaneous', 'Miscellaneous', <DocView query={{ type: 'MISCELLANEOUS' }} />),
  new _RouteData('processing', 'Processing', <Processing />),
  new _RouteData(
    'benefit-plan',
    'Benefit Plan',
    (
      <DocView
        query={{
          type: [
            'COMMUTER_BENEFIT_AGREEMENT',
            'HEALTH_INSURANCE_AGREEMENT',
            'DENTAL_PLAN_AGREEMENT',
            'HEALTH_INSURANCE_AGREEMENT',
            'VISION_PLAN_AGREEMENT',
            '_401K_PLAN',
            'EMPLOYEE_HANDBOOK',
          ],
        }}
      />
    )
  ),
]

export const topPaths: TopPath[] = topRouteData.map((data) => data.collection)

export type TopPath = typeof topRouteData[number]['collection']

export const topRouteMap = Object.fromEntries(
  topRouteData.map((route) => [route.collection, route])
) as Record<TopPath, RouteData>

export type RouteData = _RouteData<TopPath>
