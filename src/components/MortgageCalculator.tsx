import React, { useState, useEffect } from 'react';

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanToValue: number;
}

const MortgageCalculator: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<string>('5000000');
  const [downPayment, setDownPayment] = useState<string>('1000000');
  const [loanTerm, setLoanTerm] = useState<string>('15');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateMortgage = () => {
    const price = parseFloat(propertyPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const years = parseFloat(loanTerm) || 0;
    const rate = parseFloat(interestRate) || 0;

    if (price <= 0 || years <= 0 || rate < 0) {
      setResult(null);
      return;
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    if (loanAmount <= 0) {
      setResult({
        monthlyPayment: 0,
        totalPayment: down,
        totalInterest: 0,
        loanToValue: 0
      });
      return;
    }

    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments + down;
    const totalInterest = (monthlyPayment * numPayments) - loanAmount;
    const loanToValue = (loanAmount / price) * 100;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanToValue
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary-900 mb-2 flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Mortgage Calculator
        </h3>
        <p className="text-gray-600">Calculate your monthly payments and total loan costs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5,000,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1,000,000"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {propertyPrice && downPayment ? 
                `${((parseFloat(downPayment) / parseFloat(propertyPrice)) * 100).toFixed(1)}% of property price` : 
                'Recommended: 20% minimum'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="5">5 years</option>
              <option value="10">10 years</option>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (Annual %)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="8.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Current market rate: 7.5% - 12%</p>
          </div>

          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-semibold text-primary-900 mb-2">Need Help?</h4>
            <p className="text-sm text-primary-700 mb-3">
              Our loan specialists can help you find the best financing options for your property purchase.
            </p>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Contact Loan Specialist
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4">Monthly Payment</h4>
                <div className="text-3xl font-bold text-green-900 mb-2">
                  {formatCurrency(result.monthlyPayment)}
                </div>
                <p className="text-sm text-green-700">Principal & Interest</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Payment</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(result.totalPayment)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-blue-800">Loan-to-Value Ratio</span>
                  <span className="text-lg font-bold text-blue-900">{result.loanToValue.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.loanToValue}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  {result.loanToValue <= 80 ? 'Good LTV ratio' : 'Consider larger down payment'}
                </p>
              </div>

              {/* Payment Breakdown Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(propertyPrice) - parseFloat(downPayment))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Down Payment:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(downPayment))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Interest:</span>
                    <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Cost:</span>
                    <span className="font-bold">{formatCurrency(result.totalPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">Additional Costs to Consider</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Property insurance: ~0.5-1% annually</li>
                  <li>• Property tax: ~0.5-2% annually</li>
                  <li>• HOA fees: ₱1,000-5,000/month</li>
                  <li>• Maintenance: ~1-3% annually</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">Enter property details to calculate your mortgage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
