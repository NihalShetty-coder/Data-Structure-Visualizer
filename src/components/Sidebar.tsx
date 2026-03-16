import { motion } from "framer-motion";
import { 
  Layers, GitBranch, ArrowUpDown, LayoutList, 
  Network, Share2, ChevronRight 
} from "lucide-react";

const structures = [
  { id: "array", label: "Array", icon: Layers, description: "Linear indexed collection" },
  { id: "linked-list", label: "Linked List", icon: GitBranch, description: "Node chain with pointers" },
  { id: "stack", label: "Stack", icon: ArrowUpDown, description: "LIFO structure" },
  { id: "queue", label: "Queue", icon: LayoutList, description: "FIFO structure" },
  { id: "tree", label: "Binary Tree", icon: Network, description: "Hierarchical nodes" },
  { id: "graph", label: "Graph", icon: Share2, description: "Connected vertices" },
];

interface SidebarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  return (
    <div className="w-64 h-full bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
            <Network className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight">
            DSVisualizer
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 tracking-wide uppercase">
          Data Structures
        </p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all group ${
                isActive
                  ? "bg-primary/10 text-primary glow-border"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{item.description}</div>
              </div>
              <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${isActive ? "rotate-90 text-primary" : ""}`} />
            </motion.button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="text-[10px] text-muted-foreground text-center">
          v1.0.0 · Prototype
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
