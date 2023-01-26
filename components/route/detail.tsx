import { LocalDetail, StateDetail } from '../corporate'
import {
  CommonDetail,
  FundraisingDetail,
  OptionDetail,
  OptionPlanDetail,
  PreferredDetail,
  SafeDetail,
  ValuationDetail,
} from '../equity'
import {
  AdvisorDetail,
  ContractorDetail,
  DirectorDetail,
  EmployeeDetail,
  OfficerDetail,
} from '../personnel'
import { _DetailRouteData } from './base'

const detailRouteData = [
  new _DetailRouteData('advisor', 'Advisor', '/advisor', (id: string) => <AdvisorDetail id={id} />),
  new _DetailRouteData('common', 'Common Equity', '/cap-table', (id: string) => (
    <CommonDetail id={id} />
  )),
  new _DetailRouteData('director', 'Director', '/director', (id: string) => (
    <DirectorDetail id={id} />
  )),
  new _DetailRouteData('employee', 'Employee', '/employee', (id: string) => (
    <EmployeeDetail id={id} />
  )),
  new _DetailRouteData('local', 'Local', '/state-and-local', (id: string) => (
    <LocalDetail id={id} />
  )),
  new _DetailRouteData('officer', 'Officer', '/officer', (id: string) => <OfficerDetail id={id} />),
  new _DetailRouteData('option', 'Option Equity', '/cap-table', (id: string) => (
    <OptionDetail id={id} />
  )),
  new _DetailRouteData('contractor', 'Contractor', '/contractor', (id: string) => (
    <ContractorDetail id={id} />
  )),
  new _DetailRouteData('preferred', 'Preferred Equity', '/cap-table', (id: string) => (
    <PreferredDetail id={id} />
  )),
  new _DetailRouteData('safe', 'Safe Equity', '/cap-table', (id: string) => <SafeDetail id={id} />),
  new _DetailRouteData('state', 'State', '/state-and-local', (id: string) => (
    <StateDetail id={id} />
  )),
  new _DetailRouteData('valuation', 'Valuation', '/valutaion', (id: string) => (
    <ValuationDetail id={id} />
  )),
  new _DetailRouteData('optionplan', 'Stock Option Plan', '/optionplan', (id: string) => (
    <OptionPlanDetail id={id} />
  )),
  new _DetailRouteData('fundraising', 'Fundraising Round', '/fundraising', (id: string) => (
    <FundraisingDetail id={id} />
  )),
]

export type DetailCollection = typeof detailRouteData[number]['collection']

export const detailRouteMap = Object.fromEntries(
  detailRouteData.map((route) => [route.collection, route])
) as Record<DetailCollection, DetailRouteData>

export type DetailRouteData = _DetailRouteData<DetailCollection>
