const TableItem = ({ boardGame }) => {
  return (
    <div key={boardGame.id} className="card bg-dark text-white m-2" style={{ minWidth: '200px' }}>
      <img src={boardGame.image_url} className="card-img-top" alt={boardGame.name} />
      <div className="card-body">
        <h5 className="card-title">{boardGame.name}</h5>
        <p className="card-text">Producer: {boardGame.publisher}</p>
        <p className="card-text">Categories: {boardGame.category}</p>
        <p className="card-text">Year: {boardGame.year_published}</p>
        <p className="card-text">Players: {boardGame.min_players} - {boardGame.max_players}</p>
        <p className="card-text">Playtime: {boardGame.min_playtime} - {boardGame.max_playtime} mins</p>
        <p className="card-text">Age: {boardGame.age}+</p>
      </div>
    </div>
  );
};

export default TableItem;
