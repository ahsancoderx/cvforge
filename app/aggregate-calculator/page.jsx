// app/aggregate-calculator/page.jsx
// ✅ Server Component — no "use client" here

import AggregateCalculatorClient from './AggregateCalculatorClient';

export const metadata = {
  title: 'University Aggregate Calculator Pakistan 2024 | CVStudio',
  description:
    'Calculate your admission aggregate for top Pakistani universities — NUST, LUMS, UET, FAST, COMSATS and more. Free merit calculator with ECAT, NET, SAT support.',
  alternates: { canonical: '/aggregate-calculator' },
  keywords:
    'aggregate calculator Pakistan, university merit calculator, NUST aggregate, ECAT aggregate, FSc aggregate calculator, Pakistan admission 2024',
};

export default function AggregateCalculatorPage() {
  return <AggregateCalculatorClient />;
}