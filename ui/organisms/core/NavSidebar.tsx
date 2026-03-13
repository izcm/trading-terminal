'use client'

import dynamic from 'next/dynamic'

// todo: move to centralized icons.ts
import { ChartArea, LayoutGrid, Newspaper } from 'lucide-react'

import { SidebarRow } from '@/ui/molecules'

const Header = dynamic(() => import('@/ui/organisms/core/Header').then(m => m.Header), {
  ssr: false,
})

const navItems = [
  {
    title: 'feed',
    icon: Newspaper,
    id: 'feed',
  },
  {
    title: 'sales',
    icon: ChartArea,
    id: 'sales',
  },
  {
    title: 'explore',
    icon: LayoutGrid,
    id: 'explore',
  },
]

export function NavSidebar() {
  return (
    <aside>
      <div className=" flex flex-col justify-evenly h-1/2">
        {navItems.map(item => {
          const Icon = item.icon

          return <button className="btn btn-secondary">{item.title}</button>
        })}
      </div>
    </aside>
  )
}
// export function NavSidebar() {
//   return (
//     <aside className="h-full w-[250px] flex flex-col shrink-0 border-r border-default bg-surface/16">
//       {/* ---- BRAND / TITLE ---- */}
//       <div className="px-3 py-4 text-start border-b border-default">
//         <div className="text-muted">d | mrkt</div>
//         <div className="text-sm text-muted/70">client</div>
//       </div>

//       {/* ---- NAVIGATION ---- */}
//       <div className="flex-1">
//         {navItems.map(item => {
//           const Icon = item.icon

//           return (
//             <SidebarRow key={`${item.id}:navbar`}>
//               <Icon size={16} />
//               {item.title}
//             </SidebarRow>
//           )
//         })}
//       </div>

//       {/* ---- SESSION AREA ---- */}
//       <div className="border-t border-soft px-3 py-4 text-start">
//         <div className="text-xs text-text-muted mb-2">not connected</div>
//         <div className="text-sm cursor-pointer hover:text-text transition-colors">
//           connect wallet
//         </div>
//       </div>
//     </aside>
//   )
// }

// import type { ReactNode } from 'react'

// type NavItemProps = {
//   active?: boolean
//   children: ReactNode
// }

// export function SidebarRow({ active = false, children }: NavItemProps) {
//   return (
//     <div
//       className={`
//         flex gap-3 items-center px-3 py-4 cursor-pointer
//         transition-colors border-l-2 block
//         ${
//           active
//             ? 'border-accent bg-secondary'
//             : 'text-muted border-transparent hover:text-text hover:bg-secondary/70'
//         }
//       `}
//     >
//       {children}
//     </div>
//   )
// }
