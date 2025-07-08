# Builder Academy

A modern learning platform designed to provide an interactive educational experience for Builder.io users.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **CMS**: Builder.io
- **Styling**: Tailwind CSS
- **Forms**: TypeForm Integration
- **Language**: TypeScript

## 📦 Project Structure

```
.
├── app/
│   ├── [...page]/           # Dynamic page routing
│   ├── components/          # Reusable components
│   │   ├── builder/        # Builder.io integration
│   │   ├── courses/        # Course-related components
│   │   ├── homepage/       # Homepage components
│   │   └── navigation/     # Navigation components
│   ├── courses/            # Course pages
│   ├── events/             # Events pages
│   └── help/               # Help center
```

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/builder-academy.git
```

2. **Install dependencies**

```bash
npm run install
```

3. **Set up environment variables**

```env
NEXT_PUBLIC_BUILDER_API_KEY=your_api_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
