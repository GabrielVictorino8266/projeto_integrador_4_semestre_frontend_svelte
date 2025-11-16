export const plans = {
  GRATUITO: {
    id: "GRATUITO",
    name: "Essencial",
    subtitle: "(Gratuito)",
    icon: "🚗",
    price: 0,
    description:
      "Ideal para quem está começando e quer testar a plataforma sem compromisso.",
    features: [
      { text: "Até 5 motoristas", included: true },
      { text: "Até 5 veículos", included: true },
      { text: "Sem relatórios", included: false },
      { text: "Sem BI", included: false },
      { text: "Suporte simples", included: true },
    ],
    buttonText: "Começar Grátis",
    buttonClass: "btn-free",
    recommended: false,
  },
  PAGO: {
    id: "PAGO",
    name: "Corporativo",
    subtitle: "(Avançado)",
    icon: "🚚",
    price: 159.99,
    priceUnit: "/mês",
    description:
      "Para grandes frotas com foco em análise e performance avançada.",
    features: [
      { text: "Motoristas ilimitados", included: true },
      { text: "Veículos ilimitados", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "Insights de acidentes", included: true },
      { text: "BI integrado", included: true },
      { text: "Suporte completo", included: true },
    ],
    buttonText: "Assinar Completo",
    buttonClass: "btn-corporate",
    recommended: true,
  },
};
