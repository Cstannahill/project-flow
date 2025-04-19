# 📁 Project Structure & Links

## 🧱 File Tree

export const Tree = () => (
  <pre>{`
└─ ..
   ├─ app
   │  ├─ (protected)
   │  │  ├─ dashboard
   │  │  │  └─ page.tsx
   │  │  └─ projects
   │  │     └─ [id]
   │  │        ├─ apis
   │  │        │  ├─ layout.tsx
   │  │        │  ├─ openapi-spec
   │  │        │  │  └─ page.tsx
   │  │        │  └─ page.tsx
   │  │        ├─ databases
   │  │        │  └─ page.tsx
   │  │        ├─ diagrams
   │  │        │  └─ page.tsx
   │  │        ├─ features
   │  │        │  └─ page.tsx
   │  │        ├─ layout.tsx
   │  │        └─ page.tsx
   │  ├─ api
   │  │  ├─ auth
   │  │  │  ├─ register
   │  │  │  │  └─ route.ts
   │  │  │  └─ [...nextauth]
   │  │  │     └─ route.ts
   │  │  ├─ features
   │  │  │  └─ [featureId]
   │  │  │     └─ route.ts
   │  │  └─ projects
   │  │     ├─ route.ts
   │  │     └─ [id]
   │  │        ├─ apis
   │  │        │  ├─ route.ts
   │  │        │  └─ [routeId]
   │  │        │     └─ route.ts
   │  │        ├─ databases
   │  │        │  └─ route.ts
   │  │        ├─ diagrams
   │  │        │  ├─ route.ts
   │  │        │  └─ [diagramId]
   │  │        │     └─ route.ts
   │  │        ├─ features
   │  │        │  ├─ route.ts
   │  │        │  └─ [featureId]
   │  │        │     └─ route.ts
   │  │        ├─ openapi-spec
   │  │        │  ├─ rebuild
   │  │        │  │  └─ route.ts
   │  │        │  └─ route.ts
   │  │        └─ route.ts
   │  ├─ favicon.ico
   │  ├─ globals.css
   │  ├─ layout.tsx
   │  ├─ login
   │  │  └─ page.tsx
   │  ├─ page.tsx
   │  └─ signup
   │     └─ page.tsx
   ├─ components
   │  ├─ diagrams
   │  │  ├─ DiagramEditor.tsx
   │  │  ├─ DiagramModal.tsx
   │  │  └─ DiagramViewer.tsx
   │  ├─ ImageGallery.tsx
   │  ├─ LogoutButton.tsx
   │  ├─ MediaPlayer.tsx
   │  ├─ ProjectTechStack.tsx
   │  ├─ TechStackSelect.tsx
   │  ├─ ui
   │  │  ├─ cards
   │  │  │  ├─ ProjectTechStackCard.tsx
   │  │  │  └─ SortableFeatureCard.tsx
   │  │  ├─ DarkModeToggle.tsx
   │  │  ├─ DiagramsTab.tsx
   │  │  ├─ FeaturesListTab.tsx
   │  │  ├─ forms
   │  │  │  └─ ApiRouteForm.tsx
   │  │  ├─ lists
   │  │  │  └─ ApiRouteList.tsx
   │  │  ├─ modals
   │  │  │  ├─ CreateFeatureModal.tsx
   │  │  │  └─ CreateProjectModal.tsx
   │  │  ├─ Navbar.tsx
   │  │  ├─ OverviewTab.tsx
   │  │  └─ rapidoc
   │  │     └─ RapiDocComponent.tsx
   │  └─ wrappers
   │     └─ ClientProvider.tsx
   ├─ eslint.config.mjs
   ├─ lib
   │  ├─ auth.ts
   │  ├─ erDiagram.ts
   │  ├─ exportSchema.ts
   │  ├─ mermaidPresets.ts
   │  ├─ modelConfig.ts
   │  ├─ openapi
   │  │  └─ generator.ts
   │  ├─ photos.ts
   │  ├─ prisma.ts
   │  ├─ schemaParsers.ts
   │  ├─ staticAssets.ts
   │  └─ store
   │     ├─ hooks.ts
   │     ├─ store.ts
   │     └─ userSlice.ts
   ├─ middleware.ts
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ postcss.config.js
   ├─ prisma
   │  └─ schema.prisma
   ├─ public
   │  ├─ file.svg
   │  ├─ globe.svg
   │  ├─ icons
   │  │  
   │  ├─ next.svg
   │  ├─ vercel.svg
   │  └─ window.svg
   ├─ README.md
   ├─ tailwind.config.mjs
   ├─ tsconfig.json
   ├─ types
   │  ├─ base.ts
   │  └─ custom-elements.d.ts
   └─ types.ts
`}</pre>
);

<Tree />

---

## 🔗 Links

- [../app/(protected)/dashboard/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/dashboard/page.tsx>)
- [../app/(protected)/projects/[id]/apis/layout.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/apis/layout.tsx>)
- [../app/(protected)/projects/[id]/apis/openapi-spec/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/apis/openapi-spec/page.tsx>)
- [../app/(protected)/projects/[id]/apis/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/apis/page.tsx>)
- [../app/(protected)/projects/[id]/databases/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/databases/page.tsx>)
- [../app/(protected)/projects/[id]/diagrams/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/diagrams/page.tsx>)
- [../app/(protected)/projects/[id]/features/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/features/page.tsx>)
- [../app/(protected)/projects/[id]/layout.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/layout.tsx>)
- [../app/(protected)/projects/[id]/page.tsx](<https://github.com/Cstannahill/project-flow/tree/main/../app/(protected)/projects/%5Bid%5D/page.tsx>)
- [../app/api/auth/register/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/auth/register/route.ts)
- [../app/api/auth/[...nextauth]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/auth/%5B...nextauth%5D/route.ts)
- [../app/api/features/[featureId]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/features/%5BfeatureId%5D/route.ts)
- [../app/api/projects/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/route.ts)
- [../app/api/projects/[id]/apis/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/apis/route.ts)
- [../app/api/projects/[id]/apis/[routeId]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/apis/%5BrouteId%5D/route.ts)
- [../app/api/projects/[id]/databases/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/databases/route.ts)
- [../app/api/projects/[id]/diagrams/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/diagrams/route.ts)
- [../app/api/projects/[id]/diagrams/[diagramId]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/diagrams/%5BdiagramId%5D/route.ts)
- [../app/api/projects/[id]/features/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/features/route.ts)
- [../app/api/projects/[id]/features/[featureId]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/features/%5BfeatureId%5D/route.ts)
- [../app/api/projects/[id]/openapi-spec/rebuild/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/openapi-spec/rebuild/route.ts)
- [../app/api/projects/[id]/openapi-spec/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/openapi-spec/route.ts)
- [../app/api/projects/[id]/route.ts](https://github.com/Cstannahill/project-flow/tree/main/../app/api/projects/%5Bid%5D/route.ts)
- [../app/favicon.ico](https://github.com/Cstannahill/project-flow/tree/main/../app/favicon.ico)
- [../app/globals.css](https://github.com/Cstannahill/project-flow/tree/main/../app/globals.css)
- [../app/layout.tsx](https://github.com/Cstannahill/project-flow/tree/main/../app/layout.tsx)
- [../app/login/page.tsx](https://github.com/Cstannahill/project-flow/tree/main/../app/login/page.tsx)
- [../app/page.tsx](https://github.com/Cstannahill/project-flow/tree/main/../app/page.tsx)
- [../app/signup/page.tsx](https://github.com/Cstannahill/project-flow/tree/main/../app/signup/page.tsx)
- [../components/diagrams/DiagramEditor.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/diagrams/DiagramEditor.tsx)
- [../components/diagrams/DiagramModal.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/diagrams/DiagramModal.tsx)
- [../components/diagrams/DiagramViewer.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/diagrams/DiagramViewer.tsx)
- [../components/ImageGallery.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ImageGallery.tsx)
- [../components/LogoutButton.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/LogoutButton.tsx)
- [../components/MediaPlayer.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/MediaPlayer.tsx)
- [../components/ProjectTechStack.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ProjectTechStack.tsx)
- [../components/TechStackSelect.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/TechStackSelect.tsx)
- [../components/ui/cards/ProjectTechStackCard.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/cards/ProjectTechStackCard.tsx)
- [../components/ui/cards/SortableFeatureCard.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/cards/SortableFeatureCard.tsx)
- [../components/ui/DarkModeToggle.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/DarkModeToggle.tsx)
- [../components/ui/DiagramsTab.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/DiagramsTab.tsx)
- [../components/ui/FeaturesListTab.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/FeaturesListTab.tsx)
- [../components/ui/forms/ApiRouteForm.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/forms/ApiRouteForm.tsx)
- [../components/ui/lists/ApiRouteList.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/lists/ApiRouteList.tsx)
- [../components/ui/modals/CreateFeatureModal.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/modals/CreateFeatureModal.tsx)
- [../components/ui/modals/CreateProjectModal.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/modals/CreateProjectModal.tsx)
- [../components/ui/Navbar.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/Navbar.tsx)
- [../components/ui/OverviewTab.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/OverviewTab.tsx)
- [../components/ui/rapidoc/RapiDocComponent.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/ui/rapidoc/RapiDocComponent.tsx)
- [../components/wrappers/ClientProvider.tsx](https://github.com/Cstannahill/project-flow/tree/main/../components/wrappers/ClientProvider.tsx)
- [../eslint.config.mjs](https://github.com/Cstannahill/project-flow/tree/main/../eslint.config.mjs)
- [../lib/auth.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/auth.ts)
- [../lib/erDiagram.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/erDiagram.ts)
- [../lib/exportSchema.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/exportSchema.ts)
- [../lib/mermaidPresets.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/mermaidPresets.ts)
- [../lib/modelConfig.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/modelConfig.ts)
- [../lib/openapi/generator.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/openapi/generator.ts)
- [../lib/photos.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/photos.ts)
- [../lib/prisma.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/prisma.ts)
- [../lib/schemaParsers.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/schemaParsers.ts)
- [../lib/staticAssets.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/staticAssets.ts)
- [../lib/store/hooks.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/store/hooks.ts)
- [../lib/store/store.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/store/store.ts)
- [../lib/store/userSlice.ts](https://github.com/Cstannahill/project-flow/tree/main/../lib/store/userSlice.ts)
- [../middleware.ts](https://github.com/Cstannahill/project-flow/tree/main/../middleware.ts)
- [../next-env.d.ts](https://github.com/Cstannahill/project-flow/tree/main/../next-env.d.ts)
- [../next.config.ts](https://github.com/Cstannahill/project-flow/tree/main/../next.config.ts)
- [../postcss.config.js](https://github.com/Cstannahill/project-flow/tree/main/../postcss.config.js)
- [../prisma/schema.prisma](https://github.com/Cstannahill/project-flow/tree/main/../prisma/schema.prisma)
- [../public/next.svg](https://github.com/Cstannahill/project-flow/tree/main/../public/next.svg)
- [../public/vercel.svg](https://github.com/Cstannahill/project-flow/tree/main/../public/vercel.svg)
- [../public/window.svg](https://github.com/Cstannahill/project-flow/tree/main/../public/window.svg)
- [../README.md](https://github.com/Cstannahill/project-flow/tree/main/../README.md)
- [../tailwind.config.mjs](https://github.com/Cstannahill/project-flow/tree/main/../tailwind.config.mjs)
- [../tsconfig.json](https://github.com/Cstannahill/project-flow/tree/main/../tsconfig.json)
- [../types/base.ts](https://github.com/Cstannahill/project-flow/tree/main/../types/base.ts)
- [../types/custom-elements.d.ts](https://github.com/Cstannahill/project-flow/tree/main/../types/custom-elements.d.ts)
- [../types.ts](https://github.com/Cstannahill/project-flow/tree/main/../types.ts)
