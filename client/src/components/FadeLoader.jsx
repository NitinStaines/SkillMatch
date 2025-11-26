import { useEffect, useState } from 'react';

const FadeLoader = ({ text = "Loading...", duration = 500 }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      style={{
        marginTop: '2 rem',
        opacity: fade ? 0 : 1,
        transition: `opacity 2s`,
        textAlign: 'center',
        fontSize: '1.5rem',
        margin: '2rem 0'
      }}
    >
      <span className="loader" />
      {text}
      <style>
        {`
          .loader {
            display: inline-block;
            margin-right: 10px;
            width: 24px;
            height: 24px;
            border: 3px solid #1976d2;
            border-top: 3px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            vertical-align: middle;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default FadeLoader; 