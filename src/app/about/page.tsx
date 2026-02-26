import Link from 'next/link'

export default function AboutPage() {
  const team = [
    { name: 'Sophie Laurent', role: 'Founder & CEO', image: '👩‍💼' },
    { name: 'Marco Rossi', role: 'CTO', image: '👨‍💻' },
    { name: 'Elena Petrova', role: 'Head of Operations', image: '👩‍💼' },
    { name: 'Thomas Weber', role: 'Head of Sales', image: '👨‍💼' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-eu-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Connecting EU Talent with Opportunity
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            EU Jobs is the leading job board for professionals seeking careers in EU institutions,
            NGOs, think tanks, and public affairs across Europe.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe that finding the right job in the EU bubble shouldn't be complicated. 
              Our mission is to make the job search process transparent, efficient, and accessible 
              for everyone interested in European affairs.
            </p>
            <p className="text-gray-600 mb-4">
              Whether you're a recent graduate looking for your first traineeship at the European Commission,
              or a seasoned professional seeking a senior role in public affairs, we're here to help you
              find your next opportunity.
            </p>
            <p className="text-gray-600">
              For employers, we provide a targeted platform to reach qualified candidates who are
              passionate about European policy and understand the unique dynamics of the EU ecosystem.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-eu-blue">500+</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-eu-blue">200+</p>
                <p className="text-gray-600">Companies</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-eu-blue">10K+</p>
                <p className="text-gray-600">Job Seekers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-eu-blue">95%</p>
                <p className="text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-eu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in clear, honest job postings with salary information and realistic requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We promote diversity and equal opportunities for all candidates regardless of background.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">
                We streamline the hiring process to save time for both job seekers and employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 bg-eu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">{member.image}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-eu-blue py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Join thousands of professionals finding their dream EU careers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/brussels/jobs" className="bg-white text-eu-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Jobs
            </Link>
            <Link href="/post-job" className="bg-eu-yellow text-eu-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
