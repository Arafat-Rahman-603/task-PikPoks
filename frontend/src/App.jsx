import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRouter from './routes/AppRouter.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
