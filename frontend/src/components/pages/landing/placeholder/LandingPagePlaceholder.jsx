const LandingPagePlaceholder = () => {
  const singleCard = () => {
    return (
      <div className="table-item-container placeholder-glow">
        <div className="card bg-dark text-white m-2 placeholder">
          <div className="card-img-wrapper"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid landing-page-container">
      <div className="mb-5">
        <h5 className="text-light d-flex align-items-center ms-5 placeholder-glow">
          <span className="placeholder col-1 bg-secondary"></span>
        </h5>
        <div className="lading-page-card-container g-2 px-5">
          {Array(24)
            .fill()
            .map((el) => (
              <div key={el} className="d-flex justify-content-center">
                {singleCard()}
              </div>
            ))}
        </div>
      </div>
      <div className="mb-5">
        <h5 className="text-light d-flex align-items-center ms-5 placeholder-glow">
          <span className="placeholder col-2 bg-secondary"></span>
        </h5>
        <div className="lading-page-card-container g-2 px-5">
          {Array(24)
            .fill()
            .map((el) => (
              <div key={el} className="d-flex justify-content-center">
                {singleCard()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPagePlaceholder;
