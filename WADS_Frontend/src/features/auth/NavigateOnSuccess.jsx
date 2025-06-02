/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext"

const NavigateOnSuccess = ({ mutation }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (mutation.isSuccess && user) {
      navigate("/dashboard");
    }
  }, [mutation.isSuccess, navigate]);

  return null;
};

export default NavigateOnSuccess;
