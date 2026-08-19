import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
    const [chatAbierto, setChatAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text relative">

      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-alba-border">
        <h1 className="text-2xl font-bold">Alba</h1>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-8 md:px-8 md:py-16 items-center">

               <div className="bg-alba-border h-48 md:h-107 rounded-2xl overflow-hidden">
          <img src="/foto 1 alba.jpg" className="w-full h-full object-cover" alt="Alba" />
        </div>

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

                <div className="bg-alba-border h-48 md:h-107 rounded-2xl overflow-hidden">
          <img src="/foto 2 alba.jpg" className="w-full h-full object-cover" alt="Alba" />
        </div>

      </section>

      <div className="fixed bottom-6 right-6 z-10">
        {chatAbierto && (
          <div className="absolute bottom-16 right-0 w-64 bg-alba-bg border border-alba-border rounded-xl shadow-lg p-4">
            <p className="text-sm font-bold mb-2">Contáctanos</p>
            <p className="text-sm text-alba-muted mb-1">📞 964 409 009</p>
            <p className="text-sm text-alba-muted">📍 Jauja, Junín</p>
          </div>
        )}
        <button
          onClick={() => setChatAbierto(!chatAbierto)}
          className="w-12 h-12 rounded-full bg-alba-border text-alba-text flex items-center justify-center shadow-sm hover:bg-alba-muted hover:text-alba-bg transition-colors"
          aria-label="Contáctanos"
        >
          💬
        </button>
      </div>

    </div>
  );
}

export default Home;