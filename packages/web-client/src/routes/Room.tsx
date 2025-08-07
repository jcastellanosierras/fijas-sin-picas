import { useGame } from '@/context/game';
import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

export const Room: React.FC = () => {
  const { code } = useParams();
  const { room } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!room || room.code !== code) {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return <div>Room {code}</div>;
};
