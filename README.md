# Centro de Control de Producción Aquamet

Una aplicación web moderna para el control y monitoreo de la producción en el astillero Aquamet. Esta aplicación centraliza la información de 4 departamentos principales para facilitar la supervisión del Jefe de Producción.

## 🏗️ Características Principales

- **Dashboard Centralizado**: Vista general del estado de todos los departamentos
- **Monitoreo en Tiempo Real**: Actualización automática de métricas y estados
- **Sistema de Alertas**: Notificaciones visuales de eventos importantes
- **Interfaz Responsive**: Optimizada para escritorio, tablet y móvil
- **Diseño Industrial**: Estética profesional adaptada al entorno naval

## 🏢 Departamentos Monitoreados

1. **Ingeniería** - Diseño y planificación técnica
2. **Obras Civiles** - Construcción e infraestructura
3. **Naval** - Construcción naval y soldadura
4. **Eléctrico** - Sistemas eléctricos y automatización

## 🎨 Diseño Visual

### Paleta de Colores
- **Azul Corporativo**: `#1B365D` (Principal)
- **Azul Industrial**: `#2E5A87` (Secundario)
- **Estados Operativos**: Verde `#27AE60`, Naranja `#F39C12`, Rojo `#E74C3C`
- **Acentos**: Azul `#3498DB` para elementos interactivos

### Tipografía
- **Fuente Principal**: Roboto (Google Fonts)
- **Jerarquía Clara**: H1-H3 para títulos, body para contenido

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Iconografía**: Bootstrap Icons
- **Fonts**: Google Fonts (Roboto)

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 16+ instalado
- npm o yarn como gestor de paquetes

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd aquamet

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Scripts Disponibles
- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Construcción para producción
- `npm run preview` - Previsualizar build de producción

## 📊 Funcionalidades del Dashboard

### Vista General
- **Métricas Clave**: Departamentos operativos, alertas activas, proyectos en curso
- **Tarjetas de Departamentos**: Estado visual, personal, eficiencia, alertas
- **Navegación Intuitiva**: Sidebar con iconografía departamental

### Vistas Departamentales
- **Información Detallada**: Métricas específicas por departamento
- **Estado en Tiempo Real**: Indicadores visuales de operación
- **Acciones Rápidas**: Botones para ver detalles, reportes y configuración

### Sistema de Alertas
- **Modal Interactivo**: Lista completa de alertas activas
- **Categorización**: Por tipo (info, warning, critical, maintenance)
- **Timestamps**: Información temporal de cada alerta

## 🔄 Actualizaciones en Tiempo Real

- **Reloj del Sistema**: Actualización cada segundo
- **Última Actualización**: Timestamp cada 30 segundos
- **Simulación de Datos**: Cambios aleatorios cada 5 minutos para demostración

## 📱 Diseño Responsive

- **Desktop**: Layout completo con sidebar lateral
- **Tablet**: Reorganización de elementos en grid
- **Mobile**: Navegación inferior, stack vertical

## 🏗️ Arquitectura del Código

```
src/
├── main.js          # Aplicación principal y lógica de negocio
├── style.css        # Estilos CSS con custom properties
└── assets/          # Recursos estáticos

public/
├── index.html       # Estructura HTML principal
└── favicon.ico      # Icono de la aplicación
```

### Clases Principales
- `AquametDashboard`: Clase principal que maneja toda la aplicación
- Métodos de navegación, actualización de datos y gestión de eventos
- Sistema modular de componentes

## 🎯 Próximas Mejoras

- [ ] Integración con API backend real
- [ ] Gráficos interactivos con Chart.js
- [ ] Sistema de autenticación
- [ ] Exportación de reportes PDF
- [ ] Configuración personalizable de alertas
- [ ] Modo oscuro/claro
- [ ] Integración con base de datos

## 👥 Equipo de Desarrollo

- **Usuario Principal**: Daniel Droguet (Jefe de Producción)
- **Desarrollado para**: Astillero Aquamet

## 📄 Licencia

Este proyecto es de uso interno para Aquamet.

---

**Última actualización**: Julio 2025  
**Versión**: 1.0.0  
**Estado**: Desarrollo activo
