export const theme = {
  // Colores principales - CAMBIA AQUÍ para cambiar toda la app
  colors: {
    primary: "green",      // Cambia "emerald" por "green", "lime", "mint", etc.
    secondary: "lime",     // Cambia "teal" por "lime", "green", "cyan", etc.
  },

  // Clases de gradientes
  gradients: {
    text: "bg-gradient-to-r from-green-400 via-lime-400 to-green-400 bg-clip-text text-transparent",
    button: "bg-gradient-to-r from-green-400 to-lime-400",
    buttonHover: "hover:from-green-500 hover:to-lime-500",
    background: "bg-gradient-to-b from-green-50 to-white",
    backgroundReverse: "bg-gradient-to-b from-white to-green-50",
    footer: "bg-gradient-to-r from-green-800 to-lime-800",
    timeline: "bg-gradient-to-b from-green-300 to-lime-300",
    countdown: "bg-gradient-to-r from-green-500 via-lime-500 to-green-500 bg-clip-text text-transparent",
  },

  // Clases de texto
  text: {
    heading: "text-green-600",
    subheading: "text-green-700",
    body: "text-green-600",
    light: "text-green-100",
    lightHover: "hover:text-green-300",
    linkHover: "hover:text-green-600",
  },

  // Clases de bordes
  borders: {
    primary: "border-green-500",
    secondary: "border-lime-500",
    light: "border-green-400",
  },

  // Clases de focus
  focus: {
    input: "focus:border-green-500",
  },

  // Clases de backgrounds
  backgrounds: {
    card: "from-green-50 to-lime-50",
    cardReverse: "from-lime-50 to-green-50",
    success: "bg-green-50 border-green-500 text-green-700",
  },
};

// Clases como strings para usar directamente en className
export const tw = {
  heading: `text-4xl font-serif font-bold text-center ${theme.text.heading}`,
  button: `px-8 py-3 ${theme.gradients.button} text-white rounded-full font-semibold hover:shadow-lg transition-shadow shadow-md ${theme.gradients.buttonHover}`,
  card: `p-6 bg-white rounded-lg shadow-md border-l-4`,
  inputFocus: `w-full px-4 py-3 border-2 border-gray-300 rounded-lg ${theme.focus.input} focus:outline-none transition`,
};
