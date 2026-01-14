function DeleteButton() {
  const handleDelete = async () => {
    try {
      const response = await fetch("https://backendcomentarios.vercel.app/api/comentarios", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Mensagens apagadas com sucesso!");
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao apagar mensagens.");
      }
    } catch (err) {
      console.error("Erro na requisição DELETE:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
      vish
    </button>
  );
}

export default DeleteButton;
