# Documentación Frontend - MonyMonty

## 📋 Tabla de Contenidos
- [Introducción](#introducción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Componentes Principales](#componentes-principales)
- [Composables](#composables)
- [Rutas](#rutas)
- [Estilos](#estilos)

## 🎯 Introducción
Documentación técnica del frontend de la aplicación MonyMonty, una aplicación de gestión financiera.

## ⚙️ Tecnologías
- **Vue 3** - Framework principal
- **Vue Router** - Navegación entre vistas
- **Composition API** - Lógica reutilizable
- **Vite** - Herramienta de build
- **CSS Modules** - Estilos con scope

## 📁 Estructura del Proyecto
\`\`\`
src/
├── assets/              # Imágenes, iconos, fuentes
├── components/          # Componentes reutilizables
├── composables/         # Lógica reutilizable (Composition API)
├── features/            # Funcionalidades por dominio
│   ├── auth/            # Autenticación             
│   └── dashboard/       # Dashboard principal
├── router/              # Configuración de rutas
├── services/            # Servicios HTTP
└── views/               # Vistas principales
\`\`\`

## 🚀 Instalación
\`\`\`bash
# Clonar el repositorio
git clone [url-del-repo]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

## 🧩 Componentes Principales

### Autenticación
- **LoginView.vue** - Formulario de inicio de sesión
- **CrearCuentaView.vue** - Formulario de registro de usuario
- **RecuperarCuentaView.vue** - Recuperación de cuenta de usuario

### Dashboard
- **Header.vue** - Cabecera principal
- **PerfilUser.vue** - Perfil de usuario

## 🎯 Composables
- **useAuth()** - Lógica de autenticación
- **useRegisterForm()** - Lógica del formulario de registro
- **useProfile()** - Lógica del perfil de usuario

## 🛣️ Rutas
\`\`\`javascript
[
  { path: '/', component: LoginView },
  { path: '/crear-cuenta', component: RegisterForm },
  { path: '/recuperar-cuenta', component: RecoverAccountView },
  { path: '/dashboard', component: DashboardView }
]
\`\`\`

## 🎨 Estilos
- Variables CSS en `:root`
- Estilos modulares por componente
- Media queries para responsividad