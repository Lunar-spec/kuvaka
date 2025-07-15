# Gemini Frontend Clone - Kuvaka Tech Assignment

A responsive conversational AI chat application built with Next.js 15, featuring OTP authentication, chatroom management, and AI messaging simulation.

## 🌟 Live Demo

**[Live Deployment](https://kuvaka-git-master-lunarspecs-projects.vercel.app/)** - Replace with your actual deployment URL

## ✨ Features

- **Authentication**: OTP-based login/signup with country code selection
- **Dashboard**: Create/delete chatrooms with search functionality
- **Chat Interface**: Real-time messaging with AI simulation, image uploads, infinite scroll
- **UX Features**: Dark mode, responsive design, toast notifications, keyboard accessibility

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS + Radix UI
- **Deployment**: Vercel

## 📁 Project Structure

```
app/
├── (auth)/login, signup
├── (dashboard)/chat/[slug]
├── dashboard/
components/
hooks/
├── useAuth.ts, useChat.ts, useDebounce.ts
├── useInfiniteScroll.ts, useLocalStorage.ts
stores/
├── useAuthStore.ts, useChatStore.ts
├── useCountryStore.ts, useUIStore.ts
lib/
├── utils.ts, validations.ts
types/
├── auth.ts, chat.ts, ui.ts
```

## 🚀 Getting Started

1. **Clone & Install**

   ```bash
   git clone https://github.com/Lunar-spec/kuvaka.git
   cd kuvaka
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000)

## 🔧 Key Implementations

### Form Validation

- Zod schemas for phone numbers and OTP validation
- Real-time error handling with React Hook Form

### AI Response Simulation

```typescript
const AI_RESPONSES = [
  "I appreciate your question! This is a complex subject with multiple perspectives that deserve careful consideration. The fundamental principles involve interconnected systems where changes in one area can have cascading effects throughout.\n\nFrom a historical standpoint, we can see patterns that provide valuable insights into future developments. Any approach should be both flexible and grounded in evidence-based reasoning, balancing theoretical understanding with practical application.",

  "Thank you for bringing this up! This fascinating topic involves understanding how different variables interact within a larger framework. The interaction isn't simply linear – it's more like a web of connections where each element influences others.\n\nWhat's particularly interesting is how this relates to broader trends across various domains. I'd recommend starting with a solid foundation in the basics before moving to more advanced concepts, building understanding progressively.",

  "That's an excellent question that sits at the intersection of several important domains! When we examine this from multiple angles, we see patterns and connections that demonstrate the importance of systems thinking. Rather than viewing elements in isolation, we need to understand how they function as an interconnected whole.\n\nThis perspective reveals emergent properties that arise from component interactions. Effective solutions often require a holistic approach addressing multiple aspects simultaneously, coordinating efforts to avoid creating problems in other areas.",
];
```

### Infinite Scroll

- Reverse infinite scroll for chat history
- Client-side pagination (20 messages per page)
- Intersection Observer for scroll detection

### State Management

- **useAuthStore**: Authentication & OTP flow
- **useChatStore**: Chatrooms & messages
- **useCountryStore**: Country data for phone validation
- **useUIStore**: Theme & loading states

## 📱 Mobile & Accessibility

- Fully responsive design (320px to 4K)
- Keyboard navigation and ARIA labels
- Touch-optimized interactions
- Screen reader compatibility

## 🎨 UX Features

- **Dark/Light Mode**: System preference detection
- **Search**: Debounced chatroom filtering (300ms)
- **Copy to Clipboard**: Hover-activated on messages
- **Image Upload**: Drag & drop with preview
- **Toast Notifications**: Action confirmations

---

This project demonstrates modern React/Next.js development with focus on UX, performance, and accessibility.
