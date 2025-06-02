import { Component, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const token = localStorage.getItem("googleAccessToken");
      return !token ? (
        <Navigate to="/login" replace />
      ) : (
        <div>Something went wrong.</div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
