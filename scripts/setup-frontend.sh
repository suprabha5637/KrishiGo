#!/bin/bash
set -e

echo "Setting up KrishiGo Frontend..."

mkdir -p /Users/suprabhakundu/Suprabha/KrishiGo/frontend
cd /Users/suprabhakundu/Suprabha/KrishiGo/frontend

echo "Initializing Next.js Project..."
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --no-turbopack

echo "Installing Dependencies..."
npm install lucide-react react-hook-form @hookform/resolvers zod @tanstack/react-query zustand recharts framer-motion axios js-cookie date-fns
npm install -D @types/js-cookie

echo "Initializing shadcn/ui..."
npx -y shadcn@latest init -d

echo "Adding shadcn/ui components..."
npx -y shadcn@latest add button card input label dialog sheet toast tabs badge separator avatar dropdown-menu select checkbox radio-group textarea skeleton table form alert scroll-area popover command sonner tooltip

echo "Setup complete! You can now run 'npm run dev' to start the application."
