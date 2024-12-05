import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        console.log("Component mounted, setting interval.");
        intervalRef.current = window.setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        console.log(intervalRef)
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                console.log("Interval has been cleared.");
            }
        };
    }, []);

    return (
        <div>
            <h1>Current Time: {time.toLocaleTimeString()}</h1>
        </div>
    );
};

export default function ClockMain() {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to the Clock App</h1>
      <div onClick={() => navigate('/manyform')}>BUTTON</div>
      <Clock />
    </div>
  );
}
