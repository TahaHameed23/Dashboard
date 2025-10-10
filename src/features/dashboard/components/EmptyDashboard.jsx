import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export function EmptyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center mx-auto min-h-[60vh] px-4">
      <div className="max-w-md text-center space-y-6">
        {/* Icon/Illustration */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome aboard, {user?.name} 👋
        </h2>

        {/* Description */}
        <p className="text-muted-foreground">
          You don&apos;t have any analytics data yet. Let&apos;s get your first events flowing!
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/account',
            {state: {
                tab: 'api'
            }}
          )}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 rounded-lg text-slate-900 font-medium sm:font-normal"
        >
          Generate API Key to Get Started
        </button>
      </div>
    </div>
  );
}
