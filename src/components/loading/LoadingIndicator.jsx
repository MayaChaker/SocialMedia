import "./LoadingIndicator.css";

function LoadingIndicator() {
  return (
    <div className="loadingIndicator" role="status" aria-live="polite">
      <div className="loadingIndicatorSpinner" />
      <div className="loadingIndicatorText">Loading...</div>
    </div>
  );
}

export default LoadingIndicator;
