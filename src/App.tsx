import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import HeatmapPage from "./pages/HeatmapPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocationDetails from "./pages/LocationDetails";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="crowdsense-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
