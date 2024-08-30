class TextHelper {
  static renderRangeText(label, value1, value2 = null, suffix = '') {
    if (!value1 && !value2) return null;

    const text = value1 === value2 ? value1 : `${value1} - ${value2}`;
    return (
      <p className="card-text">
        <span className="fw-bold">{label}: </span> {text} {suffix}
      </p>
    );
  }
}

export default TextHelper;
