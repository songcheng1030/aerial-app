/**
 * Action Item State
 */

import { Doc, DocGroup } from './docs'

export const actionItems = DocGroup.query({}).filter((docGroup) => {
  if (Doc.isContentful(docGroup.latest)) {
    return Doc.docState(docGroup.latest, true) === 'outdated'
  }
  return docGroup.latest.type === 'UNCATEGORIZED'
})

// export const actionItems: ActionItem[] = [
//   {
//     id: 1,
//     title: 'Pay Delaware Franchise Tax',
//     days: 5,
//     buttonStr: 'Pay Tax',
//     text: 'The Delaware Franchise Tax payment is due by March 1. There are two methods of calculation used to determine the amount you owe. You may want to consult your accountant or lawyer prior to filing, and there are several third-party services that can help you file.',
//     moreInfoUrl:
//       'https://www.singlefile.io/resources/2021-delaware-franchise-tax-primer',
//     completed: false,
//   },
//   {
//     id: 2,
//     title: 'Upload Company Bylaws',
//     days: -12,
//     buttonStr: 'Upload Bylaws',
//     text: 'Your Company’s Bylaws state the rules governing your company (like the rules of a board game). While typically standard, an outside investor or their counsel needs to review these to ensure everything is normal. Also, your own legal team needs this to ensure they comply with the rules when helping you take corporate actions.',
//     moreInfoUrl: 'https://www.fundera.com/blog/corporate-bylaws',
//     completed: false,
//   },
//   {
//     id: 3,
//     title: 'Obtain Directors and Officers Insurance',
//     days: -12,
//     buttonStr: 'Upload Policy',
//     text: 'Director and Officer Insurance protects the people in charge of running your company (like founders!).  Typically inexpensive, it is a great idea for early-stage companies as they grow and accept outside capital.',
//     moreInfoUrl: 'https://www.vouch.us/coverages/directors-and-officers',
//     completed: false,
//     url: 'insurance',
//   },
//   {
//     id: 4,
//     title: 'Upload IP Assignment Agreement for Grace Hopper',
//     days: -6,
//     buttonStr: 'Upload Agreement',
//     text: 'This document is crucial for early-stage companies and can often be overlooked early in a company’s lifecycle. You need one IP Assignment Agreement for each employee at your company. Investors require it to ensure the company owns the intellectual property created by its employees, and this document provides them that reassurance.',
//     moreInfoUrl:
//       'https://www.contractscounsel.com/t/us/ip-assignment-agreement',
//     completed: false,
//     url: 'insurance',
//   },
//   {
//     id: 5,
//     title: 'Upload 83(B) Election for John von Neuman',
//     days: -4,
//     buttonStr: 'Upload Form',
//     text: 'Typically, individuals that purchase stock for low valuations and a company will file an 83(b) election with the IRS. Not filing the form within 30 days of the stock purchase could result in millions in taxes before a liquidity event.',
//     moreInfoUrl: 'https://www.cooleygo.com/what-is-a-section-83b-election/',
//     completed: false,
//     url: 'insurance',
//   },
// ]
