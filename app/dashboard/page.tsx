import DashboardContainer from '../components/dashboard/DashboardContainer';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Success Dashboard</h1>
      <DashboardContainer />
    </div>
  );
}
