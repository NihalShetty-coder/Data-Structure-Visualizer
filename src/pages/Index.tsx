import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import VisualizationCanvas from "@/components/VisualizationCanvas";
import ControlPanel from "@/components/ControlPanel";
import CodeEditorMock from "@/components/CodeEditorMock";
import { motion } from "framer-motion";

const Index = () => {
  const [selected, setSelected] = useState("array");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar selected={selected} onSelect={setSelected} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-11 border-b border-border bg-surface-1 flex items-center px-4 justify-between flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              struct://
            </span>
            <span className="text-xs font-semibold text-foreground">
              {selected.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-mono flex items-center">
              mock mode
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Visualization area */}
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <VisualizationCanvas structure={selected} />
            <ControlPanel />
          </div>

          {/* Right panel: code editor */}
          <div className="w-80 border-l border-border p-4 overflow-y-auto flex-shrink-0">
            <CodeEditorMock structure={selected} />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 bg-card border border-border rounded-lg p-3"
            >
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Info
              </h4>
              <div className="space-y-1.5">
                <InfoRow label="Type" value={selected.replace("-", " ")} />
                <InfoRow label="Elements" value="mock" />
                <InfoRow label="Complexity" value="O(n)" />
                <InfoRow label="Status" value="animating" accent />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-mono ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

export default Index;
