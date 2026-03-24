import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Layers, GitBranch, ArrowUpDown, LayoutList, 
  Network, Share2, ChevronRight, ChevronLeft 
} from "lucide-react";

const structures = [
  { id: "array", label: "Array", icon: Layers, description: "Linear indexed collection" },
  { id: "linked-list", label: "Linked List", icon: GitBranch, description: "Node chain with pointers" },
  { id: "stack", label: "Stack", icon: ArrowUpDown, description: "LIFO structure" },
  { id: "queue", label: "Queue", icon: LayoutList, description: "FIFO structure" },
  { id: "binary-tree", label: "Tree", icon: Network, description: "Hierarchical nodes" },
  { id: "graph", label: "Graph", icon: Share2, description: "Connected vertices" },
];

interface SidebarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  const navRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [slider, setSlider] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
  const [collapsed, setCollapsed] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const activeBtn = buttonRefs.current[selected];
    if (!nav || !activeBtn) return;

    setSlider({
      top: activeBtn.offsetTop,
      height: activeBtn.offsetHeight,
    });
  }, [selected, collapsed]);

  return (
    <div
      className={`h-full bg-sidebar border-r border-border flex flex-col transition-[width] duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
      data-collapsed={collapsed ? "true" : "false"}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
              <Network className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-foreground text-sm tracking-tight">
                DSVisualizer
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
            className="w-7 h-7 rounded-md hover:bg-sidebar-accent text-muted-foreground flex items-center justify-center transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {!collapsed && (
          <p className="text-[11px] text-muted-foreground mt-1.5 tracking-wide uppercase">
            Data Structures
          </p>
        )}
      </div>

      <nav
        ref={(el) => {
          navRef.current = el;
        }}
        className="liquid-group sidebar-liquid flex-1 overflow-y-auto flex flex-col gap-0.5"
      >
        {/* Liquid highlight behind the active nav item */}
        <div
          className="liquid-slider sidebar-liquid-slider"
          style={{ top: slider.top, height: slider.height }}
          aria-hidden
        />

        {structures.map((item, i) => {
          const isActive = selected === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              onClick={() => onSelect(item.id)}
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              data-active={isActive ? "true" : "false"}
              className={`sidebar-liquid-item w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all group ${
                isActive ? "sidebar-liquid-item--active" : ""
              } ${collapsed ? "justify-center px-2 gap-0" : ""}`}
            >
              <Icon className="sidebar-liquid-icon w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium sidebar-liquid-title">{item.label}</div>
                  <div className="text-[10px] sidebar-liquid-desc truncate">{item.description}</div>
                </div>
              )}
              {!collapsed && (
                <ChevronRight className="sidebar-liquid-chevron w-3 h-3 transition-transform" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground text-left">
            v1.0.0 · Prototype
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-border" aria-hidden />
      )}
    </div>
  );
};

export default Sidebar;
