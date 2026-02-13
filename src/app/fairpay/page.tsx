import FairPayCalculator from '@/components/FairPayCalculator';

export const metadata = {
  title: 'Fair Pay Calculator - EU Jobs Brussels',
  description: 'Find out the fair salary range for your role in the EU bubble. Compare compensation across consultancy, trade associations, in-house, and NGO sectors.',
};

export default function FairPayPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fair Pay Calculator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the fair salary range for your role in the Brussels EU affairs sector.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FairPayCalculator />
      </div>
    </div>
  );
}
