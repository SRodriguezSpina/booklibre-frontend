export type Tab = {
  id: string
  label: string
}

type TabsProps = {
  tabs: Tab[]
  onChange: (id: string) => void
  active: string
}

export const Tabs = ({ tabs, onChange, active }: TabsProps) => {
  return (
    <div className="flex mt-6 border-b border-accent">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 pb-2 text-center font-bold transition-colors cursor-pointer text-sm uppercase tracking-wider ${
            active === tab.id
              ? "text-primary border-b-2 border-primary"
              : "text-secondary-light hover:text-secondary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
