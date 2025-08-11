import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

import { Home } from '@/routes/Home';
import { CreateRoom } from '@/routes/CreateRoom';
import { JoinRoom } from '@/routes/JoinRoom';
import { Room } from '@/routes/Room';
import { GameProvider } from '@/context/game';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <Toaster position="top-center" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room/:code" element={<Room />} />
        </Routes> 
      </BrowserRouter>
    </GameProvider>
  </StrictMode>
);
