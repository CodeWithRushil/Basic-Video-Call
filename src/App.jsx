import { useState, useEffect } from "react";

function App() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingActive, setMeetingActive] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    if (!scheduledTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = scheduledTime - now;

      if (distance <= 0) {
        setCountdown("00:00:00");
        setCanJoin(true);
        clearInterval(interval);
      } else {
        const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0");
        setCountdown(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  const scheduleMeeting = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dateTime = new Date(formData.get("meetingTime")).getTime();

    const roomName = "room-" + Math.random().toString(36).substring(7);
    const url = `https://meet.jit.si/${roomName}`;

    setMeetingUrl(url);
    setScheduledTime(dateTime);
    setCanJoin(false);
  };

  const startMeeting = () => {
    setMeetingActive(true);
  };

  const endMeeting = () => {
    setMeetingUrl("");
    setMeetingActive(false);
    setScheduledTime(null);
    setCountdown("");
    setCanJoin(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-purple-600 font-sans p-6">
      <h1 className="text-4xl font-bold mb-6">📅 Video Conference Scheduler</h1>

      {!meetingUrl && (
        <form
          onSubmit={scheduleMeeting}
          className="flex flex-col items-center gap-4 bg-white shadow-md rounded-xl p-6"
        >
          <label className="text-lg font-semibold text-gray-700">
            Choose Meeting Time:
          </label>
          <input
            type="datetime-local"
            name="meetingTime"
            required
            className="border border-purple-300 rounded-lg px-4 py-2 focus:outline-none text-gray-700"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition"
          >
            Schedule Meeting
          </button>
        </form>
      )}

      {scheduledTime && !meetingActive && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg text-gray-700 mb-2">⏳ Countdown to Meeting:</p>
          <p className="text-3xl font-mono mb-4">{countdown}</p>
          {canJoin ? (
            <button
              onClick={startMeeting}
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition"
            >
              Join Meeting
            </button>
          ) : (
            <p className="text-gray-500">You can join once the timer ends.</p>
          )}
        </div>
      )}

      {meetingActive && (
        <div className="w-full flex flex-col items-center mt-6">
          <p className="mb-3 text-gray-700">Meeting Link (share with others):</p>
          <input
            type="text"
            readOnly
            value={meetingUrl}
            className="w-full max-w-lg border border-purple-300 rounded-lg px-4 py-2 mb-4 text-gray-700"
          />
          <button
            onClick={endMeeting}
            className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition mb-4"
          >
            End Meeting
          </button>
          <iframe
            src={meetingUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full max-w-5xl h-[600px] rounded-xl shadow-lg border border-gray-200"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
