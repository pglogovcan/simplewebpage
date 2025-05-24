"use client"
import { PropertyContactForm } from "./property-contact-form"

interface AgentContactFormProps {
  agentName: string
  agentEmail: string
  agentPhone?: string
  agentPhoto?: string
}

export function AgentContactForm({
  agentName,
  agentEmail,
  agentPhone = "+385 98 765 4321",
  agentPhoto = "/placeholder.svg",
}: AgentContactFormProps) {
  return (
    <PropertyContactForm
      agentName={agentName}
      agentEmail={agentEmail}
      agentPhone={agentPhone}
      agentPhoto={agentPhoto}
    />
  )
}
