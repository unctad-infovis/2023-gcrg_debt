function Button({ handleExit }) {
  const handleTogglePanel = () => {
    handleExit(false);
  };

  return (
    <button onClick={handleTogglePanel} className="exit-button" type="button">
      <svg aria-label="Exit" className="lucide lucide-x" fill="currentColor" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

export default Button;
