function CategoryCard({ title }) {
  return (
    <div
      style={{
        width: "180px",
        height: "120px",
        backgroundColor: "#eee",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      {title}
    </div>
  );
}

export default CategoryCard;