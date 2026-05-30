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
    respuesta: "Tonio MiniMarket se encuentra en la calle Falucho 275, en el Barrio Las Palmas, Córdoba Capital.\n Podés visitarnos en Nuestro Local o pedir con envío a domicilio a tu casa."
  },
  {
    id: "horarios",
    pregunta: "¿Cuáles son los horarios de atención y envío?",
    respuesta: "- Atención al público en el local:\nLunes a Sábados de 8:00 a 13:30 hs y de 17:00 a 21:00 hs.\nFeriados de 8:30 a 13:30 hs.\n\n - Delivery:\nLunes a Sábados de 8:00 a 21:00 hs (horario corrido).\nFeriados de 8:30 a 13:30 hs."
  },
  {
    id: "pedido",
    pregunta: "¿Cómo realizo mi pedido en la tienda online?",
    respuesta: "Es muy fácil: navegá por el catálogo, seleccioná el producto y la cantidad que necesités y agregalos al carrito. Al finalizar, hacé clic en 'Enviar Pedido por WhatsApp'. Se generará automáticamente un mensaje con el detalle de tu compra para que coordinemos la entrega."
  },
  {
    id: "pagos",
    pregunta: "¿Qué formas de pago aceptan?",
    respuesta: "Aceptamos múltiples formas de pago para tu comodidad: transferencia bancaria, pago con QR, débito, tarjeta de crédito y dinero en efectivo al momento de recibir tu compra o al retirar tu pedido en el local."
  },
  {
    id: "delivery",
    pregunta: "¿Hacen envíos a domicilio (delivery) y a qué zonas?",
    respuesta: "Sí, hacemos envíos a domicilio en el día dentro de la Ciudad de Córdoba. Si vivís dentro de un radio de 2 km del local, el envío es sin cargo. A partir de los 2 km el costo varía según la distancia, y llegamos hasta un radio de 10 km. Cuando cargás tu dirección en el carrito, el sistema calcula automáticamente la distancia y te muestra el costo exacto del envío antes de que confirmes el pedido, así sabés cuánto vas a pagar desde el principio. Si tu zona queda fuera del área de cobertura, siempre podés retirar tu pedido en el local, en Falucho 275, Barrio Las Palmas."
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
                <AccordionContent className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pb-4 whitespace-pre-line">
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
