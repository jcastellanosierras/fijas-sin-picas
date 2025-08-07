import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import { Home } from './routes/Home';
import { CreateRoom } from './routes/CreateRoom';
import { JoinRoom } from './routes/JoinRoom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
      </Routes> 
    </BrowserRouter>
  </StrictMode>
);
