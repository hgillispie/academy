import { Button } from '../components/common/Button';

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="max-w-[802px] mt-[61px] mb-0 mx-auto px-4 py-0 max-md:mt-10">
        <h1 className="text-black text-[32px] font-normal mb-6">Certification</h1>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-medium mb-4">Builder.io Certification Program</h2>
          <p className="mb-4">
            Validate your Builder.io skills and showcase your expertise with our official
            certification program.
          </p>
          <Button>Get Started</Button>
        </div>

        <h2 className="text-xl font-medium mb-4">Certification Tracks</h2>

        <div className="space-y-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Builder.io Developer</h3>
            <p className="text-sm text-gray-600 mb-2">
              For developers who build and integrate Builder.io into their applications.
            </p>
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded">
              Technical
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Builder.io Content Manager</h3>
            <p className="text-sm text-gray-600 mb-2">
              For content creators and marketers who manage content within Builder.io.
            </p>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
              Non-Technical
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Builder.io Administrator</h3>
            <p className="text-sm text-gray-600 mb-2">
              For team leads and administrators who manage Builder.io workspaces.
            </p>
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
              Mixed
            </span>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">Certification Process</h2>
        <ol className="list-decimal list-inside space-y-2 mb-8">
          <li>Complete the required courses</li>
          <li>Pass the practice assessments</li>
          <li>Schedule your certification exam</li>
          <li>Pass the exam with a score of 80% or higher</li>
          <li>Receive your digital certificate</li>
        </ol>
      </main>
    </div>
  );
}
