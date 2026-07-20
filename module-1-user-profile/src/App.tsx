import { useState } from 'react';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import QRMedicalID from './screens/QRMedicalID';
import { dummyUser, type User } from './types';

type Screen = 'login' | 'register' | 'profile' | 'qr';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User>(dummyUser);

  if (screen === 'login') {
    return <Login onLogin={() => setScreen('profile')} onGoRegister={() => setScreen('register')} />;
  }
  if (screen === 'register') {
    return <Register onRegister={() => setScreen('profile')} onGoLogin={() => setScreen('login')} />;
  }
  if (screen === 'qr') {
    return <QRMedicalID user={user} onBack={() => setScreen('profile')} />;
  }
  return (
    <Profile
      user={user}
      onUpdate={setUser}
      onLogout={() => setScreen('login')}
      onOpenQR={() => setScreen('qr')}
    />
  );
}
