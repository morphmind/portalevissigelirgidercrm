# VillaFlow

A visually stunning financial dashboard to track daily income and expenses for a villa rental business.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/morphmind/PortaLevissi)

VillaFlow is a sophisticated, visually stunning web application designed to replace a traditional Excel spreadsheet for tracking a villa rental business's daily income and expenses. The application provides a modern, intuitive dashboard interface with key performance indicators, a detailed transaction log, and streamlined data entry. It categorizes income (e.g., Rent, Bonus) and expenses (e.g., Shopping, Cleaning, Maintenance) and automatically calculates daily totals, running balances, and overall financial summaries. The goal is to offer a delightful user experience that makes financial tracking efficient, insightful, and visually pleasing.

## ✨ Key Features

-   **Modern Dashboard:** A clean, intuitive interface with key financial metrics at a glance.
-   **KPI Summary Cards:** Quickly view Total Income, Total Expenses, Net Profit, and Current Balance.
-   **Comprehensive Transaction Table:** A detailed, filterable, and sortable log of all financial entries.
-   **Streamlined Data Entry:** Add or edit transactions easily through a user-friendly modal dialog.
-   **Categorization:** Organize transactions into predefined income and expense categories.
-   **Automatic Calculations:** The app automatically computes daily totals and running balances.
-   **Responsive Design:** Flawless user experience across desktops, tablets, and mobile devices.
-   **Visually Stunning UI:** Built with a focus on visual excellence, smooth animations, and a professional aesthetic.

## 🚀 Technology Stack

-   **Frontend:**
    -   [React](https://reactjs.org/)
    -   [Vite](https://vitejs.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [TanStack Query](https://tanstack.com/query/latest)
    -   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
    -   [Recharts](https://recharts.org/) for data visualization
    -   [Framer Motion](https://www.framer.com/motion/) for animations
-   **Backend:**
    -   [Cloudflare Workers](https://workers.cloudflare.com/)
    -   [Hono](https://hono.dev/)
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for state persistence

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/villa_flow_finance_tracker.git
    cd villa_flow_finance_tracker
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

3.  **Authenticate with Cloudflare:**
    Log in to your Cloudflare account to be able to run the development server and deploy.
    ```bash
    bunx wrangler login
    ```

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:

```bash
bun dev
```

This command will:
-   Start the Vite development server for the React frontend with Hot Module Replacement (HMR).
-   Start a local `workerd` process for the Hono API backend.
-   Proxy requests from `/api/*` to the local worker.

The application will be available at `http://localhost:3000`.

## ☁️ Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    This command bundles the frontend and backend assets for production.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy script to publish your application.
    ```bash
    bun run deploy
    ```

Wrangler will handle the process of uploading your static assets and worker script to the Cloudflare network.

Alternatively, you can deploy directly from your GitHub repository with a single click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/morphmind/PortaLevissi)

## 📂 Project Structure

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components, including shadcn/ui elements.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: Application-specific API routes.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: TypeScript types and constants shared between the frontend and backend.

## 🔗 API & Data Flow

The application uses a client-server architecture.
-   The **React frontend** manages the UI and user interactions. It uses TanStack Query to communicate with the backend, handling data fetching, caching, and mutations.
-   The **Hono backend**, running on a Cloudflare Worker, exposes a RESTful API for CRUD operations on transactions.
-   All application state is persisted in a single global **Durable Object**, which provides transactional guarantees and consistent storage.