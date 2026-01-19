import React from 'react'

const SkelitonLoading = () => {
  return (
    <>
     <div className="min-h-screen bg-gray-50 py-10 animate-pulse">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="mb-6 border-b pb-4 space-y-3">
          <div className="h-8 w-3/4 rounded bg-gray-200"></div>

          <div className="flex gap-4">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-4 w-40 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <div className="h-5 w-40 rounded bg-gray-200"></div>

          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-8">
          <div className="h-12 w-40 rounded bg-gray-200"></div>
        </div>

      </div>
    </div></>
  )
}

export default SkelitonLoading