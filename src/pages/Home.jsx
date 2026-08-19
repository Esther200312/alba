import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text relative">

      {/* Barra superior */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-alba-border">
        <h1 className="text-2xl font-bold">Alba</h1>
      </nav>

      {/* Banner grande: imagen - texto - imagen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-8 md:px-8 md:py-16 items-center">

        {/* Imagen izquierda */}
        <div className="bg-alba-border h-48 md:h-107 rounded-2xl overflow-hidden">
          {/* Cuando tengas la foto real, reemplaza esta línea por:
              <img src="/ruta-de-tu-foto.jpg" className="w-full h-full object-cover" /> */}
        </div>

        {/* Texto centrado */}
        <div className="text-center px-2">
          <h2 className="text-3xl md:text-4xl font-medium mb-4" style={{ fontFamily: "Georgia" }}>
            Diseña tu reflejo
          </h2>
          <p className="text-alba-muted font-thin mb-4">
            Ropa cómoda y con estilo
          </p>
          <button
            onClick={() => navigate("/panel")}
            className="bg-alba-text text-alba-bg px-6 py-3 rounded-lg font-medium"
          >
            Ver catálogo
          </button>
        </div>

        {/* Imagen derecha */}
        <div className="bg-alba-border h-48 md:h-107 rounded-2xl overflow-hidden">
          {/* Misma foto real acá cuando la tengas */}
        </div>

      </section>

      {/* Botón flotante de contacto */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-alba-border text-alba-text flex items-center justify-center shadow-sm hover:bg-alba-muted hover:text-alba-bg transition-colors z-10"
        aria-label="Contáctanos"
      >
        💬
      </button>

    </div>
  );
}

export default Home;