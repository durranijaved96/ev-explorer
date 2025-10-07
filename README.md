
# ⚡ EV Explorer — Vehicle Listing & Detail App

A clean, performant, and responsive Electric Vehicle (EV) browser built with **Next.js (App Router)** and **TailwindCSS**.   Displays all EVs from the provided vehicle_data.json dataset.
Designed in **Figma** and optimized for speed, scalability, and accessibility.

## Getting Started

First, run the development server:

```bash
npm run dev
```
---

## Challenge Overview

This project fulfills the requirements to demonstrate how to **build and optimize** a key user-facing feature using **Next.js** and **TailwindCSS**, showcasing best practices in structure, performance, and UI/UX.

---

##  Features

### 1️⃣ Vehicle Listing Page
- Displays EVs from the provided `vehicle_data.json` dataset.
- Includes:
  - **Search bar**
  - **Filter by condition / drivetrain**
  - **Basic sorting** (price, range, year, brand)
  - **Pagination** for results
  - **PieChart** for visuallizing the first over look of the vehicles
  - **Filters** for accidents, new and drive train
- SSR-powered data fetching with query param persistence (`?sort=price&dir=asc&page=1`).

### 2 Vehicle Detail Page
- Opens via:
  - A **modal view** (fast experience for the user rathe to go on next page url)
  - A dedicated route `/vehicles/[id]` (for SEO & sharing)
- Displays:
  - Full image gallery
  - Brand, model, specs, drivetrain, and range
  - Price, accident info, and status chips
- Accessible keyboard navigation (ESC closes modal).

---

##  What is Implemented

###  **Next.js Knowledge**
- Uses both **Server and Client Components** appropriately:
  - Server-side data loading with caching (`revalidate = 60`)
  - Client components (`use client`) for interactivity
- Supports **pre-fetching** between list and detail routes.
- Uses dynamic imports for lightweight builds:
  ```tsx
  const Modal = dynamic(() => import("@/app/components/Modal"), { ssr: false });
