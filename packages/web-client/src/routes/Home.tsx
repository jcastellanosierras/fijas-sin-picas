import { Hero, ActionCards, HowToPlay } from '../components/routes/home';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Hero />
        <ActionCards />
        <HowToPlay />
      </div>
    </div>
  );
};
