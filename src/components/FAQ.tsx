import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  pregunta: string;
  respuesta: string;
}

const faqs: FAQItem[] = [
  {
    id: "ubicacion",
    pregunta: "¿Dónde está ubicado Tonio MiniMarket?",
    respuesta: "Tonio MiniMarket se encuentra en la calle Falucho 275, en el Barrio Las Palmas, Córdoba Capital, Provincia de Córdoba, Argentina (Código Postal X5003). Podés visitarnos presencialmente o pedir con envío a domicilio a tu casa."
  },
  {
    id: "horarios",
    pregunta: "¿Cuáles son los horarios de atención y envío?",
    respuesta: "Nuestros horarios de atención al público y delivery son de Lunes a Viernes de 8:00 hs a 13:30 hs y de 17:00 hs a 21:00 hs. Los Sábados y Feriados te atendemos de 8:30 hs a 13:30 hs y de 17:00 hs a 21:00 hs."
  },
  {
    id: "pedido",
    pregunta: "¿Cómo realizo mi pedido en la tienda online?",
    respuesta: "Es muy fácil: navegá por el catálogo, seleccioná la cantidad de mercadería o pollo fresco que necesités y agregalos al carrito. Al finalizar, hacé clic en 'Enviar Pedido por WhatsApp'. Se generará automáticamente un mensaje con el detalle de tu compra para que coordinemos la entrega."
  },
  {
    id: "pagos",
    pregunta: "¿Qué formas de pago aceptan?",
    respuesta: "Aceptamos múltiples formas de pago para tu comodidad: transferencia bancaria directa, dinero en cuenta o tarjetas mediante Mercado Pago (QR y link de pago) y dinero en efectivo al momento de recibir o retirar tu pedido."
  },
  {
    id: "delivery",
    pregunta: "¿Hacen envíos a domicilio (delivery) y a qué zonas?",
    respuesta: "Sí, realizamos envíos a domicilio en el día dentro de Barrio Las Palmas y zonas aledañas en Córdoba Capital. El costo del delivery se coordina directamente por WhatsApp de forma transparente al confirmar tu pedido."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-background py-16 border-t border-border/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <HelpCircle size={40} className="text-primary mb-3 animate-pulse" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary">
            Preguntas Frecuentes
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
            Respondemos tus dudas rápidas sobre compras, envíos y medios de pago en Tonio MiniMarket.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="border border-border/40 rounded-xl px-4 md:px-6 transition-all duration-200 hover:border-primary/20 bg-background/50"
              >
                <AccordionTrigger className="font-heading font-bold text-base md:text-lg text-foreground hover:text-primary hover:no-underline py-4 text-left">
                  {faq.pregunta}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pb-4">
                  {faq.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
