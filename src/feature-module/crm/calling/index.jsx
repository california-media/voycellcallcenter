import { useEffect, useState } from "react";
import { init } from "ys-webrtc-sdk-core";
import Session from "./Session";
import Incoming from "./Incoming";
import { useAppSelector } from "../../../core/data/redux/hooks";

export default function Calling({setphoneNumberEmpty}) {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState(null);
  const [pbx, setPbx] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [incomings, setIncoming] = useState([]);
  const [cause, setCause] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const clientPhoneNumber = useAppSelector((state) => state.appCommon.phone);
  const userName = "1001";
  // Sync client phone number with local state
  useEffect(() => {
    setPhoneNumber(setphoneNumberEmpty);
    setPhoneNumber(clientPhoneNumber);
  }, [clientPhoneNumber]);

  // Fetch access token and secret key
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://crm.voycell.com/admin/api_controller/get_access_token.",
          {
            method: "POST",
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        const access_token = result.data.access_token;
        getSecretKey(access_token);
      } catch (error) {
        setError(error.message);
      }
    };

    const getSecretKey = async (access_token) => {
      try {
        const responseForSecret = await fetch(
          `https://cmedia.ras.yeastar.com/openapi/v1.0/sign/create?access_token=${access_token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "1001",
              sign_type: "sdk",
              expire_time: 0,
            }),
          }
        );

        if (!responseForSecret.ok)
          throw new Error("Network response was not ok");

        const resultForSecret = await responseForSecret.json();
        const secretKeyFromResult = resultForSecret.data.sign;
        setSecretKey(secretKeyFromResult);

        const secretSaved = () => {
          localStorage.setItem("secretKey", secretKeyFromResult);
        };

        secretSaved();
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Initialize phone after secretKey is fetched
  useEffect(() => {
    if (!secretKey) return;

    init({
      username: userName,
      secret: secretKey,
      pbxURL: "https://cmedia.ras.yeastar.com/openapi/v1.0/",
      disableCallWaiting: true,
    })
      .then(({ phone, pbx }) => {
        phone.start();
        setPhone(phone);
        setPbx(pbx);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [secretKey]);

  // Outgoing call handler
  const callHandler = () => {
    if (!phone || (!number && !clientPhoneNumber)) return;

    phone.call(number || clientPhoneNumber);

    setCause("");
    setNumber("");
  };

  // Handle incoming calls and session management
  useEffect(() => {
    if (!phone) return;
    const startSession = () => {
      setSessions(Array.from(phone.sessions.values()));
    };

    const deleteSession = ({ cause }) => {
      setCause(cause);
      setSessions(Array.from(phone.sessions.values()));
    };

    const incoming = ({ session }) => {
      setIncoming([session]);
    };

    phone.on("startSession", startSession);
    phone.on("deleteSession", deleteSession);
    phone.on("incoming", incoming);

    return () => {
      phone.removeListener("startSession", startSession);
      phone.removeListener("deleteSession", deleteSession);
      phone.removeListener("incoming", incoming);
    };
  }, [phone]);

  // PBX runtime error handling
  useEffect(() => {
    if (!pbx) return;

    const runtimeErrorHandler = ({ code, message }) => {
      console.error(`PBX runtime error: code ${code}, message ${message}`);
    };

    pbx.on("runtimeError", runtimeErrorHandler);

    return () => {
      pbx.removeListener("runtimeError", runtimeErrorHandler);
    };
  }, [pbx]);

  const onNumberChange = (e) => {
    const value = e.target.value;

    // Update the number state with the current input value
    setNumber(value);

    // Clear the phone number if the input becomes empty
    if (value === "") {
      setPhoneNumber("");
    };
  }
  
    return (
      <div className="App">
        <div>
          <input
            type="text"
            value={number || phoneNumber}
            onChange={onNumberChange}
            placeholder="Enter phone number"
          />
          <button onClick={callHandler}>Call</button>
        </div>

        {incomings.length > 0 &&
          incomings.map((session) => (
            <Incoming
              key={session.status.callId}
              session={session}
              handler={() => setIncoming([])}
            />
          ))}

        {sessions.length > 0 &&
          sessions.map((session) => (
            <Session key={session.status.callId} session={session} />
          ))}

        {cause && <div>Phone call ended, Cause: {cause}</div>}
        {error && <div>Error: {error}</div>}
      </div>
    );
  }
