const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, // changed from 50 to 0
        left: 0, // changed from 50 to 0
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex", // added
        justifyContent: "center", // added
        alignItems: "center", // added
      }}
    >
      <div className="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Loading;
