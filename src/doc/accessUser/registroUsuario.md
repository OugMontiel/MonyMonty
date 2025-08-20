# Formulario de Registro

## 📋 Descripción
Componente que permite a los nuevos usuarios crear una cuenta en la aplicación.

## 🎯 Funcionalidades
- Validación de datos de usuario
- Verificación de mayoría de edad
- Validación de contraseña en tiempo real
- Navegación entre vistas

## 📊 Props
No recibe props.

## 🔄 Composables Utilizados
- `useRegisterForm()` - Lógica del formulario

## 🎨 Validación de Contraseña
Muestra reglas en tiempo real:
- ✅ Mínimo 8 caracteres
- ✅ Una letra mayúscula
- ✅ Un número
- ✅ Un símbolo especial

## 📅 Validación de Edad
Verifica que el usuario tenga al menos 18 años basado en la fecha de nacimiento ingresada.

## 🎯 Métodos

`irALogin()` | Navega a la página de login |
`irARegistarse()` | Procesa el registro |
`irAPrivacidad()` | Muestra política de privacidad |
`irACondiciones()` | Muestra términos y condiciones |

## 🎨 Estilos
Utiliza clases CSS modulares:
- `.register-form` - Contenedor principal
- `.rules-alert` - Alerta de reglas de contraseña
- `.genero-opcion` - Opciones de género