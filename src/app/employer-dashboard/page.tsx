'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState('jobs')

  // Mock data for demonstration
  const stats = {
    activeJobs: 3,
    totalApplications: 47,
    viewsThisMonth: 1234,
    shortlisted: 12,
  }

  const jobs = [
    {
      id: '1',
      title: 'Senior Policy Officer',
      status: 'active',
      applications: 23,
      views: 456,
      posted: '2025-01-10',
      expires: '2025-02-10',
    },
    {
      id: '2',
      title: 'Communications Manager',
      status: 'active',
      applications: 15,
      views: 312,
      posted: '2025-01-08',
      expires: '2025-02-08',
    },
    {
      id: '3',
      title: 'EU Affairs Trainee',
      status: 'expired',
      applications: 9,
      views: 189,
      posted: '2024-12-01',
      expires: '2025-01-01',
    },
  ]

  const applications = [
    { id: '1', name: 'Marie Dupont', job: 'Senior Policy Officer', date: '2025-01-15', status: 'new' },
    { id: '2', name: 'Jan Van Berg', job: 'Senior Policy Officer', date: '2025-01-14', status: 'reviewed' },
    { id: '3', name: 'Sofia Garcia', job: 'Communications Manager', date: '2025-01-13', status: 'shortlisted' },
    { id: '4', name: 'Thomas Mueller', job: 'Senior Policy Officer', date: '2025-01-12', status: 'new' },
    { id: '5', name: 'Anna Kowalski', job: 'Communications Manager', date: '2025-01-11', status: 'rejected' },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-eu-blue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
              <p className="text-gray-300 mt-1">Manage your job postings and applications</p>
            </div>
            <Link href="/post-job" className="bg-eu-yellow text-eu-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              + Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Views This Month</p>
            <p className="text-3xl font-bold text-gray-900">{stats.viewsThisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Shortlisted</p>
            <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-eu-blue text-eu-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'applications'
                    ? 'border-eu-blue text-eu-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-eu-blue text-eu-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:border-eu-blue transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 Posted: {job.posted}</span>
                          <span>⏰ Expires: {job.expires}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-6 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{job.applications}</p>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{job.views}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="text-sm text-eu-blue hover:underline">View Applications</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-sm text-eu-blue hover:underline">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-sm text-red-600 hover:underline">Close</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Candidate</th>
                      <th className="pb-3 font-medium">Position</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b last:border-0">
                        <td className="py-4 font-medium text-gray-900">{app.name}</td>
                        <td className="py-4 text-gray-600">{app.job}</td>
                        <td className="py-4 text-gray-600">{app.date}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="text-sm text-eu-blue hover:underline mr-3">View</button>
                          <button className="text-sm text-green-600 hover:underline mr-3">Shortlist</button>
                          <button className="text-sm text-red-600 hover:underline">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">
                  Detailed analytics and insights about your job postings will be available here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
