# CD Kulcs Storefront - Architektúra

## 🏗️ Projekt Áttekintés

Ez egy **Shopify Hydrogen** alapú React storefront, amely a **React Router v7**-et használja routing-hoz.

## 📊 Architektúra Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CD KULCS STOREFRONT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   CLIENT SIDE   │    │   SERVER SIDE   │    │   SHOPIFY    │ │
│  │                 │    │                 │    │   BACKEND    │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                      │       │
│           │                       │                      │       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    REACT ROUTER v7                         │ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   Routes    │  │ Components  │  │      Hooks &        │  │ │
│  │  │             │  │             │  │    Utilities        │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  SHOPIFY HYDROGEN                          │ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │  Storefront │  │   Analytics │  │    Session Mgmt     │  │ │
│  │  │     API     │  │             │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Mappa Struktúra

```
cd-kulcs-storefront/
├── 📁 app/                          # Fő alkalmazás mappa
│   ├── 📁 assets/                   # Statikus fájlok
│   │   └── favicon.svg
│   ├── 📁 components/               # React komponensek
│   │   ├── Header.tsx              # Navbar komponens
│   │   ├── Footer.tsx              # Footer komponens
│   │   ├── CartMain.tsx            # Kosár kezelés
│   │   ├── ProductItem.tsx         # Termék kártya
│   │   └── ...
│   ├── 📁 graphql/                 # GraphQL lekérdezések
│   │   └── customer-account/
│   │       ├── CustomerDetailsQuery.ts
│   │       └── CustomerOrdersQuery.ts
│   ├── 📁 lib/                     # Segéd függvények
│   │   ├── context.ts              # React context
│   │   ├── fragments.ts            # GraphQL fragmentek
│   │   └── session.ts              # Session kezelés
│   ├── 📁 routes/                  # React Router route-ok
│   │   ├── _index.tsx              # Főoldal (/)
│   │   ├── products.$handle.tsx    # Termék oldal
│   │   ├── collections.$handle.tsx # Kategória oldal
│   │   ├── account._index.tsx      # Felhasználói fiók
│   │   └── ...
│   ├── 📁 styles/                  # CSS fájlok
│   │   ├── app.css
│   │   ├── reset.css
│   │   └── tailwind.css
│   ├── entry.client.tsx            # Client-side entry point
│   ├── entry.server.tsx            # Server-side entry point
│   └── root.tsx                    # Fő komponens
├── 📁 public/                      # Public statikus fájlok
│   ├── cd-key-logo.png
│   └── cd-key-logo-rounded.png
├── package.json                    # NPM konfiguráció
├── react-router.config.ts          # React Router beállítások
├── vite.config.ts                  # Vite build konfiguráció
├── tunnel.sh                       # Ngrok tunnel script
└── server.ts                       # Production server
```

## 🔄 Adatfolyam (Data Flow)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │   Hydrogen  │    │   Shopify   │
│             │    │   Server    │    │   Store     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │ 1. HTTP Request   │                   │
       ├─────────────────→ │                   │
       │                   │ 2. GraphQL Query  │
       │                   ├─────────────────→ │
       │                   │                   │
       │                   │ 3. Product Data   │
       │                   │ ←─────────────────┤
       │                   │                   │
       │ 4. SSR HTML       │                   │
       │ ←─────────────────┤                   │
       │                   │                   │
       │ 5. Hydration      │                   │
       ├─────────────────→ │                   │
```

## 🛠️ Technológiai Stack

### Frontend

- **React 18.3.1** - UI library
- **React Router 7.9.2** - Routing (nem Remix!)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icon pack

### Backend/SSR

- **Shopify Hydrogen 2025.7.0** - React framework
- **Vite** - Build tool
- **GraphQL** - API kommunikáció

### Deployment

- **Shopify Oxygen** - Edge runtime
- **Ngrok** - Development tunneling

## 🚀 Scripts

```bash
npm run dev          # Development server
npm run dev:tunnel   # Dev + ngrok tunnel
npm run build        # Production build
npm run preview      # Preview build
npm run tunnel       # Csak ngrok tunnel
```

## 🛣️ Routing Mechanizmus

### File-Based Routing

A React Router **file-based routing** konvenciót használja. A `app/routes/` mappában lévő fájlnevek alapján generálódnak az URL-ek.

### Routing Konvenciók

| Fájl név                    | URL                    | Leírás                 |
| --------------------------- | ---------------------- | ---------------------- |
| `_index.tsx`                | `/`                    | Főoldal                |
| `products.$handle.tsx`      | `/products/:handle`    | Dinamikus termék oldal |
| `collections.$handle.tsx`   | `/collections/:handle` | Dinamikus kategória    |
| `account._index.tsx`        | `/account`             | Account index oldal    |
| `account.profile.tsx`       | `/account/profile`     | Profil oldal           |
| `account.orders._index.tsx` | `/account/orders`      | Rendelések lista       |
| `account.orders.$id.tsx`    | `/account/orders/:id`  | Egyedi rendelés        |
| `cart.tsx`                  | `/cart`                | Kosár oldal            |
| `search.tsx`                | `/search`              | Keresés oldal          |
| `$.tsx`                     | `/*`                   | Catch-all route (404)  |

### Speciális Route Típusok

| Konvenció | Példa                  | Leírás                         |
| --------- | ---------------------- | ------------------------------ |
| `$`       | `products.$handle.tsx` | Dinamikus paraméter            |
| `_`       | `account._index.tsx`   | Index route (alapértelmezett)  |
| `[]`      | `[robots.txt].tsx`     | Literal route (pontos egyezés) |
| `.`       | `account.profile.tsx`  | Nested route (account/profile) |

### Route Loading Mechanizmus

```typescript
// Minden route fájl exportálja:
export async function loader(args: Route.LoaderArgs) {
  // Server-side data loading
}

export const meta: Route.MetaFunction = () => {
  // SEO meta tags
};

export default function Component() {
  // React komponens
}
```

## 🔗 Teljes Route Lista

| Route                     | Fájl                                   | Leírás             |
| ------------------------- | -------------------------------------- | ------------------ |
| `/`                       | `_index.tsx`                           | Főoldal            |
| `/products/:handle`       | `products.$handle.tsx`                 | Termék oldal       |
| `/collections/:handle`    | `collections.$handle.tsx`              | Kategória oldal    |
| `/collections`            | `collections._index.tsx`               | Kategóriák lista   |
| `/account`                | `account._index.tsx`                   | Account dashboard  |
| `/account/profile`        | `account.profile.tsx`                  | Profil szerkesztés |
| `/account/orders`         | `account.orders._index.tsx`            | Rendelések         |
| `/account/orders/:id`     | `account.orders.$id.tsx`               | Egyedi rendelés    |
| `/account/addresses`      | `account.addresses.tsx`                | Címek kezelése     |
| `/cart`                   | `cart.tsx`                             | Kosár oldal        |
| `/search`                 | `search.tsx`                           | Keresés            |
| `/blogs/:handle`          | `blogs.$blogHandle._index.tsx`         | Blog kategória     |
| `/blogs/:handle/:article` | `blogs.$blogHandle.$articleHandle.tsx` | Blog cikk          |
| `/pages/:handle`          | `pages.$handle.tsx`                    | Statikus oldal     |
| `/robots.txt`             | `[robots.txt].tsx`                     | Robots.txt         |
| `/sitemap.xml`            | `[sitemap.xml].tsx`                    | Sitemap            |
| `/*`                      | `$.tsx`                                | 404 oldal          |

## 📊 Komponens Hierarchia

```
App (root.tsx)
├── PageLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation Menu
│   │   └── Header CTAs (User, Search, Cart)
│   ├── Outlet (Page Content)
│   └── Footer
└── Aside (Modals)
    ├── Cart Modal
    ├── Search Modal
    └── Mobile Menu
```

## 🔧 Konfiguráció

### React Router

- **File-based routing** - routes/ mappa alapú
- **Hydrogen preset** - Shopify optimalizációk
- **SSR enabled** - Server-side rendering

### Shopify Integration

- **Storefront API** - Termékek, kategóriák
- **Customer Account API** - Felhasználói fiók
- **Analytics** - Vásárlási adatok
- **Session Management** - Bejelentkezés

## 🌐 Development Workflow

1. **Local Development**: `npm run dev`
2. **Tunnel Setup**: `npm run tunnel` (ngrok)
3. **Shopify Auth**: Automatikus login check
4. **Hot Reload**: Vite HMR
5. **Type Safety**: TypeScript + GraphQL codegen

## 🎯 Főbb Funkciók

- ✅ **Responsive Design** - Mobile-first
- ✅ **SSR/SSG** - Server-side rendering
- ✅ **SEO Optimized** - Meta tags, structured data
- ✅ **Cart Management** - Optimistic updates
- ✅ **User Authentication** - Shopify Customer Account
- ✅ **Search & Filtering** - Predictive search
- ✅ **Analytics Integration** - Shopify Analytics
- ✅ **Performance Optimized** - Edge caching

---

_Ez a dokumentáció a CD Kulcs Storefront architektúráját mutatja be. A projekt egy modern, Shopify-alapú e-commerce megoldás React és Hydrogen technológiákkal._
