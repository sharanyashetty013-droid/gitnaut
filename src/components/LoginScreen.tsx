import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, X, AlertCircle, CheckCircle2, Compass } from 'lucide-react';
import { 
  UserProfile, 
  authenticateWithEmail, 
  authenticateWithGoogle, 
  registerNewUser, 
  setGuestMode 
} from '../utils/auth';
import { playSound } from '../utils/sound';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  isModal = false,
  onClose,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMessage('Please enter your name.');
          setIsLoading(false);
          return;
        }
        const res = registerNewUser({ name, email, password });
        if (res.success && res.user) {
          playSound('success');
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Registration failed.');
          playSound('error');
        }
      } else {
        const res = await authenticateWithEmail(email, password);
        if (res.success && res.user) {
          playSound('success');
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Invalid credentials.');
          playSound('error');
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      playSound('click');
      const res = await authenticateWithGoogle();
      if (res.success && res.user) {
        playSound('success');
        onLoginSuccess(res.user);
      }
    } catch {
      setErrorMessage('Google sign-in could not be completed.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestClick = () => {
    playSound('pop');
    setGuestMode(true);
    onContinueAsGuest();
  };

  const cardClasses = `relative w-full max-w-md bg-surface border border-border rounded-xl p-5 sm:p-8 shadow-xl text-text font-sans min-w-0 ${
    isModal ? 'max-h-[90dvh] overflow-y-auto' : ''
  }`;

  const cardContent = (
    <div className={cardClasses}>
      {/* Large close button for modals */}
      {isModal && onClose && (
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] bg-surface-2 hover:bg-border border border-border text-text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-ink mx-auto shadow-sm">
          <Compass className="w-6 h-6 text-accent-ink" strokeWidth={1.75} />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-normal">
          {isSignUp ? 'Create your Gitnaut account' : 'Welcome back to Gitnaut'}
        </h1>
        <p className="text-sm text-text-muted">
          Sign in to save your verified mission mastery and constellation streak.
        </p>
      </div>

      {/* Google One-Click Auth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="btn-secondary w-full text-sm font-semibold disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-xs text-text-muted font-medium">or email</span>
        <div className="border-t border-border w-full" />
      </div>

      {errorMessage && (
        <div className="p-3 mb-3 rounded-[10px] bg-danger/15 border border-danger text-danger text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{errorMessage}</span>
        </div>
      )}

      {forgotNotice && (
        <div className="p-3 mb-3 rounded-[10px] bg-success/15 border border-success text-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>A password recovery link has been transmitted.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-text-muted block">
              Callsign / Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" strokeWidth={1.75} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Dev"
                style={{ fontSize: '16px' }}
                className="w-full pl-10 pr-3 py-3 rounded-[10px] border border-border bg-surface-2 text-text placeholder-text-muted focus:outline-none focus:border-accent min-h-[44px]"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-text-muted block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" strokeWidth={1.75} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ fontSize: '16px' }}
              className="w-full pl-10 pr-3 py-3 rounded-[10px] border border-border bg-surface-2 text-text placeholder-text-muted focus:outline-none focus:border-accent min-h-[44px]"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-muted block">
              Password
            </label>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setForgotNotice(true)}
                className="text-xs text-text-muted hover:text-link transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" strokeWidth={1.75} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ fontSize: '16px' }}
              className="w-full pl-10 pr-3 py-3 rounded-[10px] border border-border bg-surface-2 text-text placeholder-text-muted focus:outline-none focus:border-accent min-h-[44px]"
            />
          </div>
        </div>

        {/* ONE PRIMARY BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full text-sm disabled:opacity-50"
        >
          <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </form>

      {/* Switch between Login and Sign Up */}
      <div className="text-center pt-3">
        {isSignUp ? (
          <p className="text-xs text-text-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              className="font-bold text-link hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        ) : (
          <p className="text-xs text-text-muted">
            New pilot?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              className="font-bold text-link hover:underline cursor-pointer"
            >
              Create account
            </button>
          </p>
        )}
      </div>

      {/* Guest alternative */}
      <div className="text-center pt-3 border-t border-border mt-3">
        <button
          type="button"
          onClick={handleGuestClick}
          className="text-xs text-text-muted hover:text-link font-medium underline underline-offset-4 cursor-pointer min-h-[44px] inline-flex items-center"
        >
          Try a lesson as guest without an account
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-bg flex flex-col items-center justify-center p-4">
      {cardContent}
    </div>
  );
};
