import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    // Construct the full API URL based on the environment
    const getApiUrl = () => {
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
      // If running locally, use the relative path
      if (window.location.hostname === "localhost") {
        return apiEndpoint;
      }
      // In production (Vercel), use the full URL
      return `https://fcassignment-fsgsaff4bufrg4hk.westeurope-01.azurewebsites.net/data`;
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(getApiUrl(), {
          headers: {
            "X-API-KEY": apiKey,
          },
        });
        console.log("API Response:", response.data);
        setData(response.data);
        setError(null);
        setIsActive(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
        setIsActive(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTimestampToGMTPlus1 = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return `${date.toLocaleString("en-GB", options)} (GMT+1)`;
  };

  return (
    <div className="container">
      <div className="monitor-card">
        <div className="card-header">
          <h1 className="title">Real-Time Data Monitor</h1>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className="data-container">
            <div className="data-item timestamp">
              <span className="data-label">Timestamp</span>
              <span className="data-value">
                {formatTimestampToGMTPlus1(data.timestamp)}
              </span>
            </div>
            <div className="data-item value">
              <span className="data-label">
                {isActive ? "Value" : "Last Value"}
              </span>
              <span
                className={`data-value ${isActive ? "highlight" : "inactive"}`}
              >
                {data.value}
              </span>
            </div>
            <div className="status-indicator">
              <span
                className={`status-dot ${!isActive ? "inactive" : ""}`}
              ></span>
              <span className="status-text">
                {isActive ? "Live Monitoring" : "Connection Lost"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
