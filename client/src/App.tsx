import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Generator from "@/pages/Generator";
import Scheduler from "@/pages/Scheduler";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/generator" component={Generator} />
      <Route path="/scheduler" component={Scheduler} />
      <Route path="/analytics" component={Analytics} />
      {/* Mocking other routes to Dashboard or Not Found for now */}
      <Route path="/library" component={Dashboard} /> 
      <Route path="/profile" component={Dashboard} />
      
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
