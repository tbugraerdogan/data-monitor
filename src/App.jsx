import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // State variables to manage the data, error messages, and active status of the component
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Fetch API endpoint and key from environment variables
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const apiKey = import.meta.env.VITE_API_KEY;

    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        // Make a GET request to the API
        const response = await axios.get(apiEndpoint, {
          headers: {
            "X-API-KEY": apiKey,
          },
        });
        console.log("API Response:", response.data);
        // Update state with the fetched data
        setData(response.data);
        // Reset any previous error
        setError(null);
        // Set active status to true
        setIsActive(true);
      } catch (err) {
        // Log and set error message if the API call fails
        console.error("Error fetching data:", err);
        setError("Error fetching data");
        // Set active status to false
        setIsActive(false);
      }
    };

    // Initial data fetch
    fetchData();
    // Set interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to format the timestamp to GMT+1 timezone
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
    // Format the date to a readable string in the specified timezone
    const formattedDate = date.toLocaleString("en-GB", options);
    return `${formattedDate} (GMT+1)`;
  };

  return (
    <div className="container">
      <div className="monitor-card">
        <div className="card-header">
          <h1 className="title">Real-Time Data Monitor</h1>
        </div>

        {/* Display error message if an error occurred */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {/* Display data if available */}
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
