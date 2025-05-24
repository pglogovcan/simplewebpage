import type { Agent } from "@/lib/agent-data"
import { AgentCard } from "@/components/agent-card"

interface AgentListProps {
  agents: Agent[]
  featured?: boolean
}

export function AgentList({ agents, featured = false }: AgentListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} featured={featured} />
      ))}
    </div>
  )
}
