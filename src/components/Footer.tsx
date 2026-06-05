const Footer = () => (
  <footer className="bg-footer text-footer-foreground">
    {/* Green top bar */}
    <div className="h-2 bg-secondary" />
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Brand */}
        <div>
          <a href="#inicio" className="block w-fit group">
            <span className="font-heading text-2xl font-extrabold text-footer-foreground group-hover:text-secondary mb-1 block transition-colors">TONIO MINIMARKET</span>
            <p className="font-body text-sm text-footer-foreground/60 group-hover:text-secondary transition-colors">
              Almacén & Pollería
            </p>
          </a>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-heading text-sm font-bold text-footer-foreground mb-3 uppercase tracking-wider">
            Navegación
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Inicio", href: "#inicio" },
              { label: "Ofertas", href: "#ofertas" },
              { label: "Catálogo", href: "#catalogo" },
              { label: "Horarios", href: "#horarios" },
              { label: "Preguntas Frecuentes", href: "#faq" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-sm text-footer-foreground/70 hover:text-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-sm font-bold text-footer-foreground mb-3 uppercase tracking-wider">
            Contacto
          </h4>
          <p className="font-body text-sm text-footer-foreground/70">Falucho 275, Bº Las Palmas, Córdoba Capital</p>
          <p className="font-body text-sm text-footer-foreground/70 mt-1">WhatsApp: 351 652-7241</p>
          <a
            href="https://wa.me/543516527241"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-heading text-sm font-bold text-secondary hover:underline"
          >
            Escribinos por WhatsApp →
          </a>
        </div>
      </div>

      <div className="border-t border-footer-foreground/10 mt-8 pt-6 text-center">
        <p className="font-body text-xs text-footer-foreground/60">
         © 2026 TonioMiniMarket · Todos los derechos reservados
        </p> 
      </div>
    </div>
  </footer>
);

export default Footer;
