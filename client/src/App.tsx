import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Generator from "@/pages/Generator";
import Scheduler from "@/pages/Scheduler";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { useStore } from "@/store/useStore";
import { isAuthenticated } from "@/lib/auth";

function Router() {
  const [location, setLocation] = useLocation();
  const { loadFromLocalStorage } = useStore();

  useEffect(() => {
    // Load data from localStorage on mount
    loadFromLocalStorage();

    // Redirect to login if not authenticated and not already on login page
    if (!isAuthenticated() && location !== '/login') {
      setLocation('/login');
    }
  }, []);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/generator">
        <ProtectedRoute>
          <Generator />
        </ProtectedRoute>
      </Route>
      
      <Route path="/scheduler">
        <ProtectedRoute>
          <Scheduler />
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </Route>
      
      <Route path="/library">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="socialgen-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
