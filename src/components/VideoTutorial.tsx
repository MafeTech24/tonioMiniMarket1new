import { PlayCircle } from "lucide-react";

const VideoTutorial = () => {
  return (
    <section id="tutorial" className="bg-background py-16 border-t border-border/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <PlayCircle size={40} className="text-primary mb-3 animate-pulse" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary">
            ¿Cómo hacer un pedido?
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
            Seguí estos simples pasos y recibí tu pedido en la puerta de tu casa.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto bg-card rounded-2xl p-2 sm:p-3 shadow-md border border-border/40">
          <iframe
            src="https://www.youtube.com/embed/hQoF96u2No8"
            title="¿Cómo hacer un pedido?"
            width="100%"
            style={{ aspectRatio: "16/9" }}
            className="rounded-xl border-0 shadow-inner w-full block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default VideoTutorial;
